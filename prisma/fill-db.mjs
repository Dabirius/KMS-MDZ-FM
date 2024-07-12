import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  const newUser = await prisma.advisor.create({
    data: {
      userName: 'test.test',
      firstName: 'Test',
      lastName: 'LastTest',
      email: 'new@mail.de'
    },
  });
  console.log(newUser);

  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
};