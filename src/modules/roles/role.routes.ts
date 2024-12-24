import { FastifyInstance } from "fastify";
import { createRoleJsonSchema, CreatRoleBody } from "./role.schemas";
import { createRoleHandler } from "./role.controllers";
import { PERMISSIONS } from "../../config/permissions";

export const roleRoutes = async (app: FastifyInstance) => {
  app.post<{ Body: CreatRoleBody }>(
    "/",
    {
      schema: createRoleJsonSchema,
      preHandler: [app.guard.scope(PERMISSIONS["roles:write"])],
    },
    createRoleHandler
  );
};
