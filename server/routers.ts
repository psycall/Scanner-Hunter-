import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getUserWallets,
  getDefaultWallet,
  getUserPaymentLinks,
  getPaymentLinkBySlug,
  getPaymentLinkTransactions,
  getUserTransactions,
  getDb,
  getAllUsers,
  getAllTransactions,
} from "./db";
import { wallets, paymentLinks, transactions } from "../drizzle/schema";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  wallets: router({
    list: protectedProcedure.query(({ ctx }) => getUserWallets(ctx.user.id)),
    getDefault: protectedProcedure.query(({ ctx }) => getDefaultWallet(ctx.user.id)),
    add: protectedProcedure
      .input(
        z.object({
          address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
          isDefault: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(wallets).values({
          userId: ctx.user.id,
          address: input.address,
          isDefault: input.isDefault || false,
        });
        return result;
      }),
  }),

  paymentLinks: router({
    list: protectedProcedure.query(({ ctx }) => getUserPaymentLinks(ctx.user.id)),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => getPaymentLinkBySlug(input.slug)),
    create: protectedProcedure
      .input(
        z.object({
          amount: z.string().regex(/^\d+(\.\d{1,6})?$/, "Invalid amount"),
          description: z.string().optional(),
          expiresAt: z.date().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const slug = nanoid(12);
        const result = await db.insert(paymentLinks).values({
          creatorId: ctx.user.id,
          slug,
          amount: input.amount,
          description: input.description,
          expiresAt: input.expiresAt,
          status: "active",
        });
        return { slug, ...result };
      }),
  }),

  transactions: router({
    list: protectedProcedure.query(({ ctx }) => getUserTransactions(ctx.user.id)),
    getByPaymentLink: publicProcedure
      .input(z.object({ paymentLinkId: z.number() }))
      .query(({ input }) => getPaymentLinkTransactions(input.paymentLinkId)),
  }),

  admin: router({
    getAllUsers: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only administrators can access this resource",
        });
      }
      return getAllUsers();
    }),
    getAllTransactions: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only administrators can access this resource",
        });
      }
      return getAllTransactions();
    }),
  }),
});

export type AppRouter = typeof appRouter;
