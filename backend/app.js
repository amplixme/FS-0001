const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./src/middlewares/error.middleware');
const router = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);

app.get('/', (req, res) => {
  res.json({ message: 'Server running correctly' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

app.use(errorHandler);


