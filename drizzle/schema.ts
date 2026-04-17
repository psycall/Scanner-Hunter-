import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, index, foreignKey } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Wallets table: stores Arc Testnet wallet addresses for users
 */
export const wallets = mysqlTable("wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  address: varchar("address", { length: 66 }).notNull(), // Ethereum address format
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ([
  index("idx_userId").on(table.userId),
  foreignKey({ columns: [table.userId], foreignColumns: [users.id] }).onDelete("cascade"),
]));

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = typeof wallets.$inferInsert;

/**
 * Payment links table: stores shareable payment request links
 */
export const paymentLinks = mysqlTable("paymentLinks", {
  id: int("id").autoincrement().primaryKey(),
  creatorId: int("creatorId").notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(), // Unique identifier for URL
  amount: decimal("amount", { precision: 20, scale: 6 }).notNull(), // USDC amount
  description: text("description"),
  expiresAt: timestamp("expiresAt"),
  status: mysqlEnum("status", ["active", "expired", "completed"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ([
  index("idx_creatorId").on(table.creatorId),
  index("idx_slug").on(table.slug),
  foreignKey({ columns: [table.creatorId], foreignColumns: [users.id] }).onDelete("cascade"),
]));

export type PaymentLink = typeof paymentLinks.$inferSelect;
export type InsertPaymentLink = typeof paymentLinks.$inferInsert;

/**
 * Transactions table: records all payment transactions
 */
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  paymentLinkId: int("paymentLinkId").notNull(),
  payerId: int("payerId"),
  payerAddress: varchar("payerAddress", { length: 66 }),
  amount: decimal("amount", { precision: 20, scale: 6 }).notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "failed", "expired"]).default("pending").notNull(),
  txHash: varchar("txHash", { length: 66 }), // Transaction hash from Arc Testnet
  blockNumber: int("blockNumber"),
  confirmationCount: int("confirmationCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  confirmedAt: timestamp("confirmedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ([
  index("idx_paymentLinkId").on(table.paymentLinkId),
  index("idx_payerId").on(table.payerId),
  index("idx_txHash").on(table.txHash),
  foreignKey({ columns: [table.paymentLinkId], foreignColumns: [paymentLinks.id] }).onDelete("cascade"),
  foreignKey({ columns: [table.payerId], foreignColumns: [users.id] }).onDelete("set null"),
]));

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

/**
 * Receipts table: stores proof of payment (file uploads to S3)
 */
export const receipts = mysqlTable("receipts", {
  id: int("id").autoincrement().primaryKey(),
  transactionId: int("transactionId").notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(), // S3 file key
  fileUrl: text("fileUrl").notNull(), // S3 file URL
  fileName: varchar("fileName", { length: 256 }).notNull(),
  mimeType: varchar("mimeType", { length: 64 }).notNull(),
  fileSize: int("fileSize").notNull(),
  uploadedBy: int("uploadedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ([
  index("idx_transactionId").on(table.transactionId),
  index("idx_uploadedBy").on(table.uploadedBy),
  foreignKey({ columns: [table.transactionId], foreignColumns: [transactions.id] }).onDelete("cascade"),
  foreignKey({ columns: [table.uploadedBy], foreignColumns: [users.id] }).onDelete("restrict"),
]));

export type Receipt = typeof receipts.$inferSelect;
export type InsertReceipt = typeof receipts.$inferInsert;