import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Puxa as credenciais do .env ou usa valores padrão genéricos para quem clonar o projeto (open-source)
  const username = process.env.ADMIN_USERNAME || 'admin';
  const plainPassword = process.env.ADMIN_PASSWORD || 'password';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { username },
    update: {},
    create: {
      username,
      password: hashedPassword,
    },
  });

  console.log(`✅ Usuário administrador criado/atualizado: ${user.username}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
