import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserBody, LoginBody } from "./users.schemas";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "../roles/roles.services";
import {
  assignRoleToUser,
  createUser,
  getUserByApplication,
  getUserByEmail,
} from "./users.services";
import jwt from "jsonwebtoken";
import { users } from "../../db/schema";

export const createUserHandler = async (
  request: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply
) => {
  const { initialUser, ...data } = request.body;
  const roleName = initialUser
    ? SYSTEM_ROLES.SUPER_ADMIN
    : SYSTEM_ROLES.APPLICATION_USER;

  if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
    const appUsers = await getUserByApplication(data.applicationId);
    console.log(appUsers);
    if (appUsers.length > 0) {
      return reply.code(400).send({
        message: " Application already has super admin user",
        extension: {
          code: "APPLICATION_ALREADY_SUPER_USER",
          applicationId: data.applicationId,
        },
      });
    }
  }

  const role = await getRoleByName({
    name: roleName,
    applicationId: data.applicationId,
  });

  if (!role) {
    return reply.code(404).send({
      message: "Role not found",
    });
  }
  try {
    const user = await createUser(data);

    await assignRoleToUser({
      userId: user.id,
      roleId: role.id,
      applicationId: data.applicationId,
    });
    return user;
  } catch (error) {
    throw new Error("error");
  }
};

export const loginHandler = async (
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) => {
  const { applicationId, email, password } = request.body;
  const user = getUserByEmail({ email, applicationId });
  if (!user) {
    return reply.code(400).send({ msg: "invalid cresential" });
  }
  //   const token = jwt.sign({});
};
