import express from 'express';
import cors from 'cors';
import { authRoutes } from './modules/auth/auth.routes';

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (_, res) => {
  return res.json({
    message: 'API PetShop Online',
  });
});

app.use('/auth', authRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});