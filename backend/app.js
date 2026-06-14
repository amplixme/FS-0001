const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./src/middlewares/error.middleware');
const router = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedProductionOrigin = process.env.CORS_ORIGIN;

const isLocalhostOrigin = (origin) => {
  return /^http:\/\/localhost:\d+$/.test(origin);
};

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== 'production' && isLocalhostOrigin(origin)) {
      return callback(null, true);
    }

    if (
      process.env.NODE_ENV === 'production' &&
      allowedProductionOrigin &&
      origin === allowedProductionOrigin
    ) {
      return callback(null, true);
    }

    return callback(new Error('Origen no permitido por CORS'));
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', router);

app.get('/', (req, res) => {
  res.json({ message: 'Server running correctly' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

app.use(errorHandler);
