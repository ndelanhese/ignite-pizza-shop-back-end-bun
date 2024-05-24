import { env } from "@env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/db/schema/index.ts",
	out: "./drizzle",
	migrations: {
		table: "pizza_shop_migrations",
		schema: "public",
	},
	dbCredentials: {
		url: env.DB_URL ?? "",
	},
});
