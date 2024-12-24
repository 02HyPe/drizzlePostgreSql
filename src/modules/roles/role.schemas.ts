import { z } from "zod";
import { ALL_PERMISSION } from "../../config/permissions";
import zodToJsonSchema from "zod-to-json-schema";

const createRoleBodySchema = z.object({
  name: z.string(),
  permissions: z.array(z.enum(ALL_PERMISSION)),
  //   applicationId: z.string().uuid(),
});

export type CreatRoleBody = z.infer<typeof createRoleBodySchema>;

export const createRoleJsonSchema = {
  body: zodToJsonSchema(createRoleBodySchema, "createRoleBodySchema"),
};
