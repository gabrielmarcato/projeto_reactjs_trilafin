import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { initSchema } from './db.ts';
import { seed } from './seed.ts';
import { authRoutes } from './routes/auth.ts';
import { dataRoutes } from './routes/data.ts';

const PORT = Number(process.env.PORT ?? 3333);
const JWT_SECRET = process.env.JWT_SECRET ?? 'trilhafin-dev-secret-change-me';

async function main(): Promise<void> {
  initSchema();
  seed();

  const app = Fastify({ logger: true });

  // Em dev, reflete a origem do front (Vite). Restrinja em produção.
  await app.register(cors, { origin: true, credentials: true });
  await app.register(jwt, { secret: JWT_SECRET });

  app.decorate('authenticate', async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch {
      await reply.code(401).send({ error: 'Não autorizado' });
    }
  });

  app.get('/health', async () => ({ ok: true }));
  await app.register(authRoutes);
  await app.register(dataRoutes);

  await app.listen({ port: PORT, host: '0.0.0.0' });
  app.log.info(`API do Trilha.Fin em http://localhost:${PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
