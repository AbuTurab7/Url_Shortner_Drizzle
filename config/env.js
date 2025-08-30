import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config({ path: join(__dirname, "../.env") });

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(" env ERROR:", parsed.error.format());
  process.exit(1); 
}

export const env = parsed.data;


