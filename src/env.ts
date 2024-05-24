import { z } from "zod";

const envSchema = z.object({
	DB_URL: z.string().url().min(1),
	API_PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);
