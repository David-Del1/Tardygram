import express from 'express';
import notFoundMiddleware from './middleware/not-found.js';
import errorMiddleware from './middleware/error.js';
import cookieParser from 'cookie-parser';
// controllers
import authController from './controllers/auth.js';
import postController from './controllers/posts.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
//controllers
app.use(authController);
app.use(postController);

app.use(notFoundMiddleware);
app.use(errorMiddleware);



export default app;
