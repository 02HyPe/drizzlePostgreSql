import { FastifyInstance } from "fastify";
import {
  assignRoleToUserHandler,
  createUserHandler,
  loginHandler,
} from "./users.controllers";
import {
  AssignRoleToUserBody,
  assignRoleToUserJsonSchema,
  createUserJsonSchema,
  LoginJsonSchema,
} from "./users.schemas";
import { PERMISSIONS } from "../../config/permissions";

export const usersRoutes = async (app: FastifyInstance) => {
  app.post("/", { schema: createUserJsonSchema }, createUserHandler);
  app.post("/login", { schema: LoginJsonSchema }, loginHandler);
  app.post<{ Body: AssignRoleToUserBody }>(
    "/roles",
    {
      schema: assignRoleToUserJsonSchema,
      preHandler: [app.guard.scope(PERMISSIONS["users:roles:write"])],
    },
    assignRoleToUserHandler
  );
};
