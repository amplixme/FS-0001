import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const prisma = require('../config/prisma.js');

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../services/post.service.js');

it('crea un post correctamente', async () => {
  const mockPost = {
    id: 'post-1',
    title: 'Mi Post',
    content: 'Contenido',
  };

  vi.spyOn(prisma.post, 'create').mockResolvedValue(mockPost);

  const result = await createPost({
    title: 'Mi Post',
    content: 'Contenido',
    authorId: 'user-1',
  });

  expect(prisma.post.create).toHaveBeenCalled();

  expect(result).toEqual(mockPost);
});

it('obtiene posts paginados', async () => {
  vi.spyOn(prisma.post, 'findMany').mockResolvedValue([
    {
      id: '1',
      title: 'Post',
      _count: {
        comments: 2,
      },
    },
  ]);

  vi.spyOn(prisma.post, 'count').mockResolvedValue(1);

  const result = await getAllPosts();

  expect(result.total).toBe(1);
  expect(result.data).toHaveLength(1);
  expect(result.data[0].commentCount).toBe(2);
});

it('obtiene un post por id', async () => {
  const post = {
    id: 'post-1',
    title: 'Test',
  };

  vi.spyOn(prisma.post, 'findFirst').mockResolvedValue(post);

  const result = await getPostById('post-1');

  expect(result).toEqual(post);
});

it('actualiza un post siendo autor', async () => {
  vi.spyOn(prisma.post, 'findUnique').mockResolvedValue({
    id: 'post-1',
    authorId: 'user-1',
  });

  vi.spyOn(prisma.post, 'update').mockResolvedValue({
    id: 'post-1',
    title: 'Nuevo',
  });

  const result = await updatePost({
    id: 'post-1',
    data: { title: 'Nuevo' },
    user: {
      id: 'user-1',
      role: 'USER',
    },
  });

  expect(prisma.post.update).toHaveBeenCalled();
  expect(result.title).toBe('Nuevo');
});

it('actualiza un post siendo admin', async () => {
  vi.spyOn(prisma.post, 'findUnique').mockResolvedValue({
    id: 'post-1',
    authorId: 'otro-user',
  });

  vi.spyOn(prisma.post, 'update').mockResolvedValue({
    id: 'post-1',
  });

  await updatePost({
    id: 'post-1',
    data: { title: 'Editado' },
    user: {
      id: 'admin-1',
      role: 'ADMIN',
    },
  });

  expect(prisma.post.update).toHaveBeenCalled();
});

it('lanza 404 cuando el post no existe', async () => {
  vi.spyOn(prisma.post, 'findUnique').mockResolvedValue(null);

  await expect(
    updatePost({
      id: 'inexistente',
      data: {},
      user: {
        id: 'user-1',
        role: 'USER',
      },
    }),
  ).rejects.toMatchObject({
    message: 'Post no encontrado',
    status: 404,
  });
});
