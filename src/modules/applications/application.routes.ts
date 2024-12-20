import { FastifyInstance } from "fastify";
import {
  createApplicationHandler,
  getApplicationsHandler,
} from "./application.controllers";
import { createApplicationJsonSchema } from "./applications.schemas";

export const applicationRoutes = (app: FastifyInstance) => {
  app.post(
    "/",
    { schema: createApplicationJsonSchema },
    createApplicationHandler
  );

  app.get("/", getApplicationsHandler);
};
