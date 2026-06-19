const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const problems = await prisma.problem.findMany({
      where: { solvedBy: "by me" },
      orderBy: { createdAt: 'desc' }
    });
    console.log("Success! Array length:", problems.length);
  } catch (error) {
    console.error("Prisma error:", error.stack || error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
