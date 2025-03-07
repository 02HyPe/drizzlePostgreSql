import { InferInsertModel, eq, and } from "drizzle-orm";
import { applications, roles, users, userToRoles } from "../../db/schema";
import { db } from "../../db";
import argon2 from "argon2";

export const createUser = async (data: InferInsertModel<typeof users>) => {
  const hashedPassword = await argon2.hash(data.password);

  const result = await db
    .insert(users)
    .values({ ...data, password: hashedPassword })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      applicationId: applications.id,
    });

  return result[0];
};

export const getUserByApplication = async (applicationId: string) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.applicationId, applicationId));

  return result;
};

export const assignRoleToUser = async (
  data: InferInsertModel<typeof userToRoles>
) => {
  const result = await db.insert(userToRoles).values(data).returning();
  return result[0];
};

export const getUserByEmail = async ({
  email,
  applicationId,
}: {
  email: string;
  applicationId: string;
}) => {
  const result = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      applicationId: users.applicationId,
      roleId: roles.id,
      password: users.password,
      permissions: roles.permissions,
    })
    .from(users)
    .where(and(eq(users.email, email), eq(users.applicationId, applicationId)))
    .leftJoin(
      userToRoles,
      and(
        eq(userToRoles.userId, users.id),
        eq(userToRoles.applicationId, users.applicationId)
      )
    )
    .leftJoin(roles, eq(roles.id, userToRoles.roleId));

  if (!result.length) {
    return null;
  }

  const user = result.reduce((acc, curr) => {
    if (!acc.id) {
      return {
        ...curr,
        permissions: new Set(curr.permissions),
      };
    }

    if (!curr.permissions) {
      return acc;
    }

    for (const permission of curr.permissions) {
      acc.permissions.add(permission);
    }

    return acc;
  }, {} as Omit<(typeof result)[number], "permissions"> & { permissions: Set<string> });

  return {
    ...user,
    permissions: Array.from(user.permissions),
  };
};
