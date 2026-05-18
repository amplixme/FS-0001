const { PrismaClient } = require("@prisma/client");
const AppError = require("../utils/AppErrors");
const prisma = new PrismaClient();

const getAllCategories = async () => {
	const categories = await prisma.category.findMany({
		include: {
			_count: {
				select: { posts: true },
			},
		},
		orderBy: { name: "asc" },
	});

	return categories;
};

const createCategory = async ({ name, slug }) => {
	const category = await prisma.category.create({
		data: { name, slug },
	});

	return category;
};

const updateCategory = async (id, data) => {
	const category = await prisma.category.findUnique({ where: { id } });

	if (!category) {
		throw new AppError("Categoría no encontrada", 404);
	}

	const updated = await prisma.category.update({
		where: { id },
		data,
	});

	return updated;
};

const deleteCategory = async (id) => {
	const category = await prisma.category.findUnique({
		where: { id },
		include: {
			_count: {
				select: { posts: true },
			},
		},
	});

	if (!category) {
		throw new AppError("Categoría no encontrada", 404);
	}

	if (category._count.posts > 0) {
		throw new AppError(
			"No se puede eliminar una categoría con posts asociados",
			409,
		);
	}

	await prisma.category.delete({ where: { id } });
};

module.exports = {
	getAllCategories,
	createCategory,
	updateCategory,
	deleteCategory,
};
