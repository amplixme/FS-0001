const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'Demo123!';

const user = [
  {
    name: 'Valeria Méndez',
    email: 'admin@demo.com',
    role: 'ADMIN',
  },
   {
    name: 'Lucía Torres',
    email: 'lucia@demo.com',
    role: 'USER',
  },
  {
    name: 'Marcos Silva',
    email: 'marcos@demo.com',
    role: 'USER',
  },
  {
    name: 'Sofía Ramírez',
    email: 'sofia@demo.com',
    role: 'USER',
  },
];

const categories = [
  { name: 'Tecnología', slug: 'tecnologia' },
  { name: 'Desarrollo Web', slug: 'desarrollo-web' },
  { name: 'Inteligencia Artificial', slug: 'inteligencia-artificial' },
  { name: 'Carrera Profesional', slug: 'carrera-profesional' },
  { name: 'Productividad', slug: 'productividad' },
];

const coverImages = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
];

const posts = [
  {
    title: 'Cómo empezar en desarrollo web sin perderse en el camino',
    content:
      'Aprender desarrollo web puede sentirse abrumador al principio. Hay muchos lenguajes, frameworks y opiniones distintas. Una buena estrategia es comenzar por HTML, CSS y JavaScript, construir proyectos pequeños y recién después avanzar hacia herramientas como React o Node.js.',
    categorySlugs: ['desarrollo-web', 'carrera-profesional'],
  },
  {
    title: 'React: componentes, estado y una forma distinta de pensar interfaces',
    content:
      'React cambió la forma en que muchos equipos construyen interfaces. En lugar de pensar una pantalla como un bloque gigante, se divide en componentes reutilizables. El estado permite que la interfaz responda a las acciones del usuario.',
    categorySlugs: ['desarrollo-web', 'tecnologia'],
  },
  {
    title: 'Qué es una API REST y por qué aparece en casi todos los proyectos',
    content:
      'Una API REST permite que frontend y backend se comuniquen usando HTTP. Cuando una aplicación necesita listar posts, crear usuarios o enviar comentarios, suele hacerlo a través de endpoints.',
    categorySlugs: ['desarrollo-web', 'tecnologia'],
  },
  {
    title: 'Inteligencia artificial en el trabajo diario de un programador',
    content:
      'La inteligencia artificial no reemplaza la necesidad de entender programación. Su mayor valor aparece cuando se usa como apoyo para revisar código, explicar errores o acelerar tareas repetitivas.',
    categorySlugs: ['inteligencia-artificial', 'tecnologia'],
  },
  {
    title: 'Cómo armar un portfolio técnico que realmente muestre tus habilidades',
    content:
      'Un portfolio no necesita tener veinte proyectos. Es mejor mostrar pocos trabajos, pero bien explicados. Cada proyecto debería incluir qué problema resuelve, qué tecnologías usa, qué decisiones tomaste y qué aprendiste.',
    categorySlugs: ['carrera-profesional', 'desarrollo-web'],
  },
  {
    title: 'Node.js y Express: una puerta de entrada al backend',
    content:
      'Node.js permite ejecutar JavaScript del lado del servidor, y Express facilita la creación de APIs. Con pocas líneas se pueden definir rutas, middlewares y controladores.',
    categorySlugs: ['desarrollo-web', 'tecnologia'],
  },
  {
    title: 'Prisma ORM explicado con palabras simples',
    content:
      'Prisma funciona como una capa entre la aplicación y la base de datos. En lugar de escribir SQL manual para cada operación, se trabaja con modelos y métodos como findMany, create o update.',
    categorySlugs: ['desarrollo-web', 'productividad'],
  },
  {
    title: 'Hábitos de estudio para aprender programación de forma sostenible',
    content:
      'La constancia le gana a los atracones de estudio. Programar una hora por día, resolver ejercicios pequeños y documentar errores frecuentes suele ser más efectivo que estudiar diez horas una vez por semana.',
    categorySlugs: ['carrera-profesional', 'productividad'],
  },
  {
    title: 'El rol de Git en el trabajo colaborativo',
    content:
      'Git no es solo una herramienta para guardar versiones. En equipos, permite trabajar en ramas, revisar cambios y recuperar estados anteriores del proyecto.',
    categorySlugs: ['desarrollo-web', 'productividad'],
  },
  {
    title: 'Cómo leer errores sin entrar en pánico',
    content:
      'Un error no es una sentencia de muerte del proyecto. Muchas veces el mensaje ya dice exactamente dónde mirar: archivo, línea y causa probable. Debuggear también se aprende.',
    categorySlugs: ['carrera-profesional', 'productividad'],
  },
  {
    title: 'Qué mirar antes de elegir una librería para tu proyecto',
    content:
      'No todas las librerías populares son la mejor opción para un proyecto. Conviene mirar documentación, mantenimiento, cantidad de dependencias y compatibilidad con el stack actual.',
    categorySlugs: ['tecnologia', 'desarrollo-web'],
  },
  {
    title: 'Diseño de interfaces: pequeñas decisiones que mejoran la experiencia',
    content:
      'Una buena interfaz no depende solamente de colores atractivos. Espaciado, jerarquía visual, textos claros y estados de carga hacen que una aplicación se sienta más confiable.',
    categorySlugs: ['desarrollo-web', 'productividad'],
  },
  {
    title: 'Automatización: cuándo conviene y cuándo no',
    content:
      'Automatizar una tarea repetitiva puede ahorrar tiempo, pero no todo proceso necesita automatización inmediata. Primero conviene entender el flujo manual, detectar errores frecuentes y medir el impacto.',
    categorySlugs: ['tecnologia', 'productividad'],
  },
  {
    title: 'Cómo prepararse para una entrevista técnica junior',
    content:
      'Una entrevista técnica no evalúa solamente si sabés la respuesta perfecta. También observa cómo pensás, cómo explicás tus decisiones y cómo reaccionás ante un problema nuevo.',
    categorySlugs: ['carrera-profesional'],
  },
  {
    title: 'Bases de datos relacionales para desarrolladores frontend',
    content:
      'Aunque trabajes principalmente en frontend, entender bases de datos ayuda a diseñar mejores interfaces. Saber qué es una tabla, una relación, una clave primaria o una consulta filtrada permite conversar mejor con backend.',
    categorySlugs: ['desarrollo-web', 'tecnologia'],
  },
];

const commentContents = [
  'Muy claro el enfoque. Me sirvió para ordenar conceptos que tenía mezclados.',
  'Me gustó el ejemplo porque baja el tema a algo aplicable en proyectos reales.',
  'Este tipo de explicación ayuda mucho cuando uno está empezando.',
  'Interesante punto de vista. Me gustaría ver una segunda parte con ejemplos prácticos.',
  'Coincido totalmente. La constancia termina pesando más que intentar aprender todo de golpe.',
  'Excelente artículo. Lo voy a guardar para repasarlo después.',
  'Me pasó algo parecido trabajando en un proyecto personal.',
  'La parte sobre buenas prácticas me pareció muy útil.',
  'Está bueno que no se quede solo en teoría y hable del proceso.',
  'Muy buen recordatorio sobre la importancia de entender antes de automatizar.',
  'Me gustaría ver más contenido sobre cómo aplicar esto en equipos pequeños.',
  'El ejemplo de debugging es tal cual lo que pasa en la vida real.',
  'Gracias por explicarlo de una forma simple y directa.',
  'Creo que este tema es clave para quienes vienen de aprender solos.',
  'Buenísimo. Me ayudó a pensar cómo mejorar mi portfolio.',
  'La explicación sobre APIs me pareció especialmente clara.',
  'Me quedo con la idea de no agregar herramientas sin entender el costo.',
  'Muy útil para entrevistas técnicas y para organizar el estudio.',
  'Me gustaría que sumen ejemplos de código en próximos posts.',
  'La comparación entre teoría y práctica está muy bien planteada.',
  'Este contenido está ideal para una demo del proyecto.',
  'La sección de productividad me pareció muy realista.',
  'Me gustó que el artículo no venda soluciones mágicas.',
  'Es un buen punto de partida para seguir investigando.',
  'La explicación de Prisma está muy bien para principiantes.',
  'Este post resume varias dudas frecuentes de quienes arrancan.',
  'Me sirvió para entender mejor cómo pensar componentes.',
  'Muy buen enfoque para trabajar con ramas y commits.',
  'La parte de carrera profesional suma muchísimo.',
  'Contenido claro, concreto y bien orientado a la práctica.',
];

async function cleanDatabase () {
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

async function createUsers () {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  return Promise.all(
    user.map((user) =>
      prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: passwordHash,
          role: user.role,
        },
      }),
    ),
  );
}

async function createCategories() {
  return Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: category,
      }),
    ),
  );
}

async function createPosts(createdUsers, createdCategories) {
  const createdPosts = [];
  const userAuthors = createdUsers.filter((user) => user.role === 'USER');

  const categoriesBySlug = createdCategories.reduce((acc, category) => {
    acc[category.slug] = category;
    return acc;
  }, {});

  for (let index = 0; index < posts.length; index += 1) {
    const post = posts[index];
    const author = userAuthors[index % userAuthors.length];

    const createdPost = await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        published: true,
        coverImage: coverImages[index % coverImages.length],
        author: {
          connect: {
            id: author.id,
          },
        },
        categories: {
          connect: post.categorySlugs.map((slug) => ({
            id: categoriesBySlug[slug].id,
          })),
        },
      },
    });

    createdPosts.push(createdPost);
  }

  return createdPosts;
}

async function createComments(createdUsers, createdPosts) {
  const comments = commentContents.map((content, index) => {
    const author = createdUsers[index % createdUsers.length];
    const post = createdPosts[index % createdPosts.length];

    return {
      content,
      authorId: author.id,
      postId: post.id,
    };
  });

  await prisma.comment.createMany({
    data: comments,
  });
}

async function main() {
  console.log('Limpiando datos existentes...');
  await cleanDatabase();

  console.log('Creando usuarios demo...');
  const createdUsers = await createUsers();

  console.log('Creando categorías...');
  const createdCategories = await createCategories();

  console.log('Creando posts...');
  const createdPosts = await createPosts(createdUsers, createdCategories);

  console.log('Creando comentarios...');
  await createComments(createdUsers, createdPosts);

  console.log('Seed completado correctamente');
  console.log({
    users: createdUsers.length,
    categories: createdCategories.length,
    posts: createdPosts.length,
    comments: commentContents.length,
    demoPassword: DEMO_PASSWORD,
  });
}

main()
  .catch((error) => {
    console.error('Error ejecutando seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    prisma.$disconnect();
  });