import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// 用户数据模拟（实际项目中应使用数据库）
const users: any[] = [];

// 用户注册
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    // 检查用户是否已存在
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).json({ message: '用户已存在' });
    }
    
    // 加密密码
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // 创建新用户
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword
    };
    
    users.push(newUser);
    
    // 生成JWT令牌
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET || 'minecraft_server_panel_secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: '用户注册成功',
      token,
      user: {
        id: newUser.id,
        username: newUser.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误' });
  }
});

// 用户登录
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'minecraft_server_panel_secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误' });
  }
});

export default router;