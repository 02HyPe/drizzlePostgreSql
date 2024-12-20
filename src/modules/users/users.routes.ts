import { FastifyInstance } from "fastify";
import { createUserHandler } from "./users.controllers";
import { createUserJsonSchema } from "./users.schemas";

export const usersRoutes = async (app: FastifyInstance) => {
  app.post("/", { schema: createUserJsonSchema }, createUserHandler);
};
