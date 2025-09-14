import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 导入路由模块
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import serverRoutes from './routes/server';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// 用户相关路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// 与主服务端通信的路由
app.use('/api/server', serverRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Minecraft Server Panel Client Backend' });
});

app.listen(PORT, () => {
  console.log(`Client backend server is running on port ${PORT}`);
});