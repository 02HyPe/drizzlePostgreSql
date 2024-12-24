import { FastifyReply, FastifyRequest } from "fastify";
import { CreatRoleBody } from "./role.schemas";
import { createRole } from "./role.services";

export const createRoleHandler = async (
  request: FastifyRequest<{ Body: CreatRoleBody }>,
  reply: FastifyReply
) => {
  const { name, permissions } = request.body;
  const user = request.user;
  const applicationId = user.applicationId;

  const role = await createRole({ name, permissions, applicationId });

  return role;
};
