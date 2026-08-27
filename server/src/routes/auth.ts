import type { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import { db } from '../db.ts';
import { loginSchema } from '../schemas.ts';

interface UserRow {
  id: string;
  username: string;
  passwordHash: string;
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post('/auth/login', async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Dados inválidos' });
    }
    const { username, password } = parsed.data;

    const user = db
      .prepare('SELECT * FROM users WHERE username = ?')
      .get(username) as UserRow | undefined;

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return reply.code(401).send({ error: 'Usuário ou senha inválidos' });
    }

    const token = app.jwt.sign({ sub: user.id, username: user.username });
    return { token, user: { username: user.username } };
  });

  app.get('/auth/me', { preHandler: [app.authenticate] }, async (req) => ({
    user: req.user,
  }));
}
