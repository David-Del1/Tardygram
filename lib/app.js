import express from 'express';
import notFoundMiddleware from './middleware/not-found.js';
import errorMiddleware from './middleware/error.js';
// controllers
import authController from './controllers/auth.js';

const app = express();

app.use(express.json());
//controllers
app.use(authController);

app.use(notFoundMiddleware);
app.use(errorMiddleware);



export default app;
