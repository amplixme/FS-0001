const { Router } = require("express");
const router = Router();

// To add a new route:
// const postRoutes = require('./post.routes');
// router.use('/posts', postRoutes);

const authRoutes = require("./auth.routes");
const postRoutes = require("./post.routes");
const categoryRoutes = require("./category.routes");
const uploadRoutes = require('./upload.routes');
const commentRoutes = require('./comment.routes');

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

//Mounted routes
router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/categories", categoryRoutes);
router.use("/upload", uploadRoutes);
router.use('/posts/:postId/comments', commentRoutes);

module.exports = router;
