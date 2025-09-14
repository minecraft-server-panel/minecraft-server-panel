import { Router, Request, Response } from 'express';

const router = Router();

// 存储服务端信息（实际项目中应使用数据库）
let serverConfig = {
  host: 'localhost',
  port: 5000,
  token: ''
};

// 获取服务端配置
router.get('/config', (req: Request, res: Response) => {
  res.json(serverConfig);
});

// 更新服务端配置
router.put('/config', (req: Request, res: Response) => {
  const { host, port, token } = req.body;
  
  if (host) serverConfig.host = host;
  if (port) serverConfig.port = port;
  if (token) serverConfig.token = token;
  
  res.json({
    message: '服务端配置已更新',
    config: serverConfig
  });
});

// 获取服务端状态
router.get('/status', (req: Request, res: Response) => {
  // 这里应该实际连接到主服务端获取状态
  // 暂时返回模拟数据
  res.json({
    connected: true,
    status: 'running',
    players: 0,
    maxPlayers: 20
  });
});

// 发送命令到服务端
router.post('/command', (req: Request, res: Response) => {
  const { command } = req.body;
  
  // 这里应该实际将命令发送到主服务端
  // 暂时返回模拟数据
  res.json({
    message: `命令 "${command}" 已发送到服务端`,
    success: true
  });
});

export default router;