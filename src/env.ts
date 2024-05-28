import { z } from "zod";

const envSchema = z.object({
	DB_URL: z.string().url().min(1),
	API_BASE_URL: z.string().url().min(1),
	AUTH_REDIRECT_URL: z.string().url().min(1),
	JWT_SECRET_KEY: z.string(),
	API_PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);
