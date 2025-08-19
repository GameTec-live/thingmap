import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";

// biome-ignore lint/style/noNonNullAssertion: This is a env var, its fine
export const db = drizzle(process.env.DB_FILE_NAME!);
