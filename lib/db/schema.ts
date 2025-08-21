import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("email_verified", { mode: "boolean" })
        .$defaultFn(() => false)
        .notNull(),
    image: text("image"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const session = sqliteTable("session", {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
        mode: "timestamp",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
        mode: "timestamp",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
});

export const map = sqliteTable("map", {
    id: text().primaryKey(),
    name: text().notNull(),
    description: text(),
    createdAt: integer({ mode: "timestamp" }).$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: integer({ mode: "timestamp" }).$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    ownerId: text()
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const pin = sqliteTable("pin", {
    id: text().primaryKey(),
    mapId: text()
        .notNull()
        .references(() => map.id, { onDelete: "cascade" }),
    title: text().notNull(),
    description: text(),
    link: text(),
    createdAt: integer({ mode: "timestamp" }).$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: integer({ mode: "timestamp" }).$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    creatorId: text()
        .notNull()
        .references(() => user.id),
    latitude: real().notNull(),
    longitude: real().notNull(),
});

export const favoritePin = sqliteTable("favoritePin", {
    id: text().primaryKey(),
    userId: text()
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    pinId: text()
        .notNull()
        .references(() => pin.id, { onDelete: "cascade" }),
    createdAt: integer({ mode: "timestamp" }).$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: integer({ mode: "timestamp" }).$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
});

export const favoriteMap = sqliteTable("favoriteMap", {
    id: text().primaryKey(),
    userId: text()
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    mapId: text()
        .notNull()
        .references(() => map.id, { onDelete: "cascade" }),
    createdAt: integer({ mode: "timestamp" }).$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: integer({ mode: "timestamp" }).$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
});

export const suggestion = sqliteTable("suggestion", {
    id: text().primaryKey(),
    userId: text()
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    mapId: text()
        .notNull()
        .references(() => map.id, { onDelete: "cascade" }),
    title: text().notNull(),
    description: text(),
    link: text(),
    latitude: real().notNull(),
    longitude: real().notNull(),
    isIssue: integer({ mode: "boolean" }).notNull(),
    createdAt: integer({ mode: "timestamp" }).$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: integer({ mode: "timestamp" }).$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
});
