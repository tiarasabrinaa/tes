import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import api from './api';
// import errorHandler from './middlewares/error-handler';
// import notFound from './middlewares/not-found';

dotenv.config();

const app = express();

const corsOptions: CorsOptions = {
  // origin: (origin, callback) => {
  //   if (!origin || allowlist.includes(origin)) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error('Not allowed by CORS'));
  //   }
  // },
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600, // 10 minutes
};

app.use(morgan('dev'));
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/v1', api);
console.log('[server]: Router loaded');

// Error handling
// app.use(notFound);
// app.use(errorHandler);

export default app;
