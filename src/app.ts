import express from 'express';
import { router  } from './middlewares/authMiddleware';

const app = express();

app.use(express.json());

app.use(router);

app.listen(3333, () => {
  console.log('🚀🚀 Server Started!')
});

export { app };