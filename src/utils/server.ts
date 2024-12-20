import { fastify } from "fastify";
import { applicationRoutes } from "../modules/applications/application.routes";
import { usersRoutes } from "../modules/users/users.routes";

export const buildServer = async () => {
  const app = fastify({
    logger: true,
  });

  app.register(applicationRoutes, { prefix: "/api/applications" });
  app.register(usersRoutes, { prefix: "/api/users" });

  return app;
};
