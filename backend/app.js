const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./src/middlewares/error.middleware');
const authRoutes = require('./src/routes/auth.routes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server running correctly' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

app.use(errorHandler);
