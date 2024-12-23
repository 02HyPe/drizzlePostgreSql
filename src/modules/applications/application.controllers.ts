import { FastifyReply, FastifyRequest } from "fastify";
import { CreateApplicationBody } from "./applications.schemas";
import { createApplication, getApplications } from "./application.services";
import { createRole } from "../roles/role.services";
import {
  ALL_PERMISSION,
  SYSTEM_ROLES,
  USER_ROLE_PERMISSIONS,
} from "../../config/permissions";

export const createApplicationHandler = async (
  request: FastifyRequest<{ Body: CreateApplicationBody }>,
  reply: FastifyReply
) => {
  const { name } = request.body;

  const application = await createApplication({ name });

  const superAdminRolePromise = await createRole({
    applicationId: application.id,
    name: SYSTEM_ROLES.SUPER_ADMIN,
    permissions: ALL_PERMISSION as unknown as Array<string>,
  });

  const applicationUserRolePromise = await createRole({
    applicationId: application.id,
    name: SYSTEM_ROLES.APPLICATION_USER,
    permissions: USER_ROLE_PERMISSIONS,
  });

  const [superAdminRole, applicationUserRole] = await Promise.allSettled([
    superAdminRolePromise,
    applicationUserRolePromise,
  ]);

  if (
    superAdminRole.status === "rejected" ||
    applicationUserRole.status === "rejected"
  ) {
    throw new Error("error with creating super admin");
  }

  return {
    application,
    superAdminRole: superAdminRole.value,
    applicationUserRole: applicationUserRole.value,
  };
};

export const getApplicationsHandler = async () => {
  return getApplications();
};
