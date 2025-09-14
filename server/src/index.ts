import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Minecraft Server Panel API' });
});

// 创建HTTP服务器
const server = createServer(app);

// 创建WebSocket服务器
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket客户端已连接');
  
  ws.on('message', (message) => {
    console.log('收到消息:', message.toString());
    // 回显消息
    ws.send(`服务器收到: ${message.toString()}`);
  });

  ws.on('close', () => {
    console.log('WebSocket客户端断开连接');
  });

  ws.send('欢迎连接到Minecraft Server Panel WebSocket服务');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});