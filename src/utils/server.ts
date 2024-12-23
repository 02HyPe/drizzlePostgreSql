import { fastify, FastifyReply, FastifyRequest } from "fastify";
import { applicationRoutes } from "../modules/applications/application.routes";
import { usersRoutes } from "../modules/users/users.routes";
import { roleRoutes } from "../modules/roles/role.routes";
import guard from "fastify-guard";
import jwt, { JwtPayload } from "jsonwebtoken";

type User = {
  id: string;
  applicationId: string;
  scopes: Array<string>;
};

declare module "fastify" {
  interface FastifyRequest {
    user: User;
  }
}

export const buildServer = async () => {
  const app = fastify({
    logger: false,
  });

  app.decorateRequest("user");
  app.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        return;
      }
      try {
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, "supersecretpoi") as User;

        request.user = decoded;
      } catch (error) {
        reply.code(401).send({ msg: "error with authorization" });
        return;
      }
    }
  );

  app.register(guard, {
    requestProperty: "user",
    scopeProperty: "scopes",
    errorHandler(result, request, reply) {
      reply.send({ msg: "invalid / unauthorized" });
      return;
    },
  });

  app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send({ msg: "ok" });
  });
  app.register(applicationRoutes, { prefix: "/api/applications" });
  app.register(usersRoutes, { prefix: "/api/users" });
  app.register(roleRoutes, { prefix: "/api/roles" });

  return app;
};
