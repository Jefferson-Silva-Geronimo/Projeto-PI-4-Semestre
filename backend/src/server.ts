import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./database/prisma";

const server = app.listen(env.PORT, () => {
  console.log(`Servidor rodando na porta ${env.PORT}`);
});

async function shutdown(signal: string) {
  console.log(`Sinal ${signal} recebido. Encerrando servidor...`);

  server.close(async () => {
    await prisma.$disconnect();

    console.log("Servidor encerrado com segurança.");

    process.exit(0);
  });
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
