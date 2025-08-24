import {
    boolean,
    doublePrecision,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified")
        .$defaultFn(() => false)
        .notNull(),
    image: text("image"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: timestamp("updated_at").$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
});

export const map = pgTable("map", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    description: text(),
    public: boolean().notNull().default(true),
    createdAt: timestamp("created_at").$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: timestamp("updated_at").$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    ownerId: text()
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const pin = pgTable("pin", {
    id: uuid().primaryKey().defaultRandom(),
    mapId: uuid()
        .notNull()
        .references(() => map.id, { onDelete: "cascade" }),
    title: text().notNull(),
    description: text(),
    link: text(),
    createdAt: timestamp("created_at").$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: timestamp("updated_at").$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    creatorId: text()
        .notNull()
        .references(() => user.id),
    address: text(),
    latitude: doublePrecision().notNull(),
    longitude: doublePrecision().notNull(),
});

export const favoritePin = pgTable("favoritePin", {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    pinId: uuid()
        .notNull()
        .references(() => pin.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: timestamp("updated_at").$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
});

export const favoriteMap = pgTable("favoriteMap", {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    mapId: uuid()
        .notNull()
        .references(() => map.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: timestamp("updated_at").$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
});

export const suggestion = pgTable("suggestion", {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    mapId: uuid()
        .notNull()
        .references(() => map.id, { onDelete: "cascade" }),
    title: text().notNull(),
    description: text(),
    link: text(),
    latitude: doublePrecision().notNull(),
    longitude: doublePrecision().notNull(),
    isIssue: boolean().notNull(),
    createdAt: timestamp("created_at").$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
    updatedAt: timestamp("updated_at").$defaultFn(
        () => /* @__PURE__ */ new Date(),
    ),
});
