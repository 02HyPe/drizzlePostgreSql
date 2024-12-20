import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

//crete user
const createUserBodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  applicationId: z.string().uuid(),
  password: z.string().min(6),
  initialUser: z.boolean().optional(),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;

export const createUserJsonSchema = {
  body: zodToJsonSchema(createUserBodySchema, "createUserBodySchema"),
};

//login

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  applicationId: z.string(),
});

export type LoginBody = z.infer<typeof loginSchema>;

export const LoginBodyJsonSchema = {
  body: zodToJsonSchema(loginSchema, "loginSchema"),
};
