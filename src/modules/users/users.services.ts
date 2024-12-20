import { InferInsertModel, eq, and } from "drizzle-orm";
import { applications, users, userToRoles } from "../../db/schema";
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
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.applicationId, applicationId)));

  if (!result.length) {
    return null;
  }
  return result;
};
