import { fastify, FastifyReply, FastifyRequest } from "fastify";
import { applicationRoutes } from "../modules/applications/application.routes";
import { usersRoutes } from "../modules/users/users.routes";

export const buildServer = async () => {
  const app = fastify({
    logger: false,
  });

  app.register(applicationRoutes, { prefix: "/api/applications" });
  app.register(usersRoutes, { prefix: "/api/users" });
  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send({ msg: "ok" });
  });

  return app;
};
