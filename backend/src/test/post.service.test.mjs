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
