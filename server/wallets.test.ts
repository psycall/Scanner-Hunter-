import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("wallets", () => {
  it("should list user wallets", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const wallets = await caller.wallets.list();
    expect(Array.isArray(wallets)).toBe(true);
  });

  it("should validate wallet address format", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.wallets.add({
        address: "invalid-address",
        isDefault: false,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid");
    }
  });

  it("should accept valid ethereum address", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.wallets.add({
      address: "0x1234567890123456789012345678901234567890",
      isDefault: true,
    });

    expect(result).toBeDefined();
  });
});

describe("payment links", () => {
  it("should create payment link with valid amount", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.paymentLinks.create({
      amount: "100.50",
      description: "Test payment",
    });

    expect(result).toBeDefined();
    expect(result.slug).toBeDefined();
    expect(result.slug.length).toBe(12);
  });

  it("should reject invalid amount format", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.paymentLinks.create({
        amount: "invalid",
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid");
    }
  });

  it("should list user payment links", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const links = await caller.paymentLinks.list();
    expect(Array.isArray(links)).toBe(true);
  });
});

describe("auth", () => {
  it("should return current user", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();
    expect(user).toBeDefined();
    expect(user?.id).toBe(1);
    expect(user?.openId).toBe("test-user-1");
  });
});
