import { roles } from "../../db/schema";
import { db } from "../../db";
import { and, eq, InferInsertModel } from "drizzle-orm";

export const createRole = async (data: InferInsertModel<typeof roles>) => {
  const result = await db.insert(roles).values(data).returning();
  return result[0];
};

export const getRoleByName = async ({
  name,
  applicationId,
}: {
  name: string;
  applicationId: string;
}) => {
  const result = await db
    .select()
    .from(roles)
    .where(and(eq(roles.name, name), eq(roles.applicationId, applicationId)))
    .limit(1);

  return result[0];
};
