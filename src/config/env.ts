import zennv from "zennv";
import { z } from "zod";

export const env = zennv({
  dotenv: true,
  schema: z.object({
    PORT: z.number().default(9002),
    HOST: z.string().default("localhost"),
    DATABASE_URL: z.string(),
  }),
});
