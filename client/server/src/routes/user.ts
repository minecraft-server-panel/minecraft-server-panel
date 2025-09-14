import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// 用户数据模拟（实际项目中应使用数据库）
const users: any[] = [];
const userPreferences: any = {};

// 验证JWT中间件
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '访问令牌缺失' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'minecraft_server_panel_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: '访问令牌无效' });
    }
    (req as any).user = user;
    next();
  });
};

// 获取用户信息
router.get('/profile', authenticateToken, (req: Request, res: Response) => {
  const user = users.find(u => u.id === (req as any).user.userId);
  if (!user) {
    return res.status(404).json({ message: '用户未找到' });
  }
  
  res.json({
    id: user.id,
    username: user.username
  });
});

// 更新用户偏好设置
router.put('/preferences', authenticateToken, (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const preferences = req.body;
  
  userPreferences[userId] = preferences;
  
  res.json({
    message: '偏好设置已更新',
    preferences
  });
});

// 获取用户偏好设置
router.get('/preferences', authenticateToken, (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const preferences = userPreferences[userId] || {};
  
  res.json(preferences);
});

export default router;