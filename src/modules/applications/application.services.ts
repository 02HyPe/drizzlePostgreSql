import { applications } from "../../db/schema";
import { db } from "../../db";
import { InferInsertModel } from "drizzle-orm";

export const createApplication = async (
  data: InferInsertModel<typeof applications>
) => {
  const result = await db.insert(applications).values(data).returning();

  return result[0];
};

export const getApplications = async () => {
  const result = await db
    .select({
      id: applications.id,
      name: applications.name,
      createdAt: applications.createdAt,
    })
    .from(applications);

  return result;
};
