const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPost = async ({ title, content, authorId }) => {
    const post = await prisma.post.create({
        data: { title, content, authorId },
        include: {
            author: { select: { name: true } },
        },
    });

    return post;
};

module.exports = { createPost };