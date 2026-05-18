const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Tecnología', slug: 'tecnologia' },
    { name: 'Diseño', slug: 'diseno' },
    { name: 'Programación', slug: 'programacion' },
    { name: 'DevOps', slug: 'devops' },
    { name: 'Opinión', slug: 'opinion' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('Categorías creadas correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
