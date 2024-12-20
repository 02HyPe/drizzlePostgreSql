import { logger } from "./utils/logger";
import { buildServer } from "./utils/server";
import { env } from "./config/env";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";

const gracefulShutdown = async ({
  app,
}: {
  app: Awaited<ReturnType<typeof buildServer>>;
}) => {
  await app.close();
};

const main = async () => {
  const app = await buildServer();

  app.listen({
    port: env.PORT,
    host: env.HOST,
  });

  await migrate(db, {
    migrationsFolder: "./migrations",
  });

  const signals = ["SIGINT", "SIGTERM"];

  // logger.debug(env, "ussing env");

  for (const signal of signals) {
    process.on(signal, () => {
      // console.log("signal", signal);
      gracefulShutdown({ app });
    });
  }
  console.log("hello fastify");
  logger.info(`Server is running on http://localhost:9002`);
};
main();
