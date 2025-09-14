const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('开始创建分体式包...');

const releaseDir = path.join(__dirname, 'release', 'separate');

// 清空发布目录
if (fs.existsSync(releaseDir)) {
  console.log('清空发布目录...');
  fs.rmSync(releaseDir, { recursive: true });
}

if (!fs.existsSync(releaseDir)) {
  fs.mkdirSync(releaseDir, { recursive: true });
}

// 直接复制源文件到发布目录，不进行构建
console.log('复制源文件...');

// 创建客户端包
const clientDir = path.join(releaseDir, 'client');

// 清空客户端目录
if (fs.existsSync(clientDir)) {
  console.log('清空客户端目录...');
  fs.rmSync(clientDir, { recursive: true });
}

if (!fs.existsSync(clientDir)) {
  fs.mkdirSync(clientDir, { recursive: true });
}

console.log('创建客户端包...');
// 复制客户端源文件（排除node_modules和dist）
const clientSrc = path.join(__dirname, '..', 'client');
copyDirSync(clientSrc, clientDir, { exclude: ['node_modules', 'dist'] });

// 创建客户端启动脚本
const clientStartScript = `
const { spawn } = require('child_process');
const path = require('path');

console.log('启动客户端...');

// 安装依赖
console.log('正在安装依赖...');
const install = spawn('pnpm', ['install'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit'
});

install.on('close', (code) => {
  if (code === 0) {
    // 启动客户端前端 (端口 3000)
    const frontend = spawn('npx', ['vite', 'preview', '--port', '3000', '--host'], {
      cwd: path.join(__dirname, 'client'),
      stdio: 'inherit'
    });

    // 启动客户端后端 (端口 4000)
    const backend = spawn('npm', ['run', 'start'], {
      cwd: path.join(__dirname, 'client', 'server'),
      stdio: 'inherit'
    });

    // 错误处理
    frontend.on('error', (err) => {
      console.error('客户端前端启动错误:', err);
    });

    backend.on('error', (err) => {
      console.error('客户端后端启动错误:', err);
    });

    // 优雅关闭
    process.on('SIGINT', () => {
      console.log('正在关闭客户端服务...');
      frontend.kill();
      backend.kill();
      process.exit(0);
    });
  } else {
    console.error('依赖安装失败');
    process.exit(1);
  }
});
`;

fs.writeFileSync(path.join(clientDir, 'start.js'), clientStartScript);

// 创建客户端package.json用于生产环境
const clientPackageJson = {
  "name": "minecraft-server-panel-client",
  "version": "1.0.0",
  "description": "Minecraft服务器面板客户端",
  "main": "start.js",
  "scripts": {
    "start": "node start.js"
  },
  "dependencies": {
    "vite": "^4.3.9"
  }
};

fs.writeFileSync(path.join(clientDir, 'package.json'), JSON.stringify(clientPackageJson, null, 2));

// 创建 Windows 启动脚本
const clientStartBat = `@echo off
cd /d %~dp0
echo 正在启动客户端...
node start.js
pause`;

fs.writeFileSync(path.join(clientDir, 'start.bat'), clientStartBat);

// 创建 Linux/macOS 启动脚本
const clientStartSh = `#!/bin/bash
cd "$(dirname "$0")"
echo "正在启动客户端..."
node start.js`;

fs.writeFileSync(path.join(clientDir, 'start.sh'), clientStartSh);
// 给予执行权限 (在Linux/macOS中)
try {
  fs.chmodSync(path.join(clientDir, 'start.sh'), 0o755);
} catch (err) {
  // 忽略错误，因为在Windows上可能会失败
}

// 创建服务端包
const serverDir = path.join(releaseDir, 'server');

// 清空服务端目录
if (fs.existsSync(serverDir)) {
  console.log('清空服务端目录...');
  fs.rmSync(serverDir, { recursive: true });
}

if (!fs.existsSync(serverDir)) {
  fs.mkdirSync(serverDir, { recursive: true });
}

console.log('创建服务端包...');
// 复制服务端源文件（排除node_modules和dist）
const serverSrc = path.join(__dirname, '..', 'server');
copyDirSync(serverSrc, serverDir, { exclude: ['node_modules', 'dist'] });

// 创建服务端启动脚本
const serverStartScript = `
const { spawn } = require('child_process');
const path = require('path');

console.log('启动服务端...');

// 安装依赖
console.log('正在安装依赖...');
const install = spawn('pnpm', ['install'], {
  cwd: path.join(__dirname),
  stdio: 'inherit'
});

install.on('close', (code) => {
  if (code === 0) {
    // 启动服务端 (端口 5000)
    const server = spawn('npm', ['run', 'start'], {
      cwd: path.join(__dirname),
      stdio: 'inherit'
    });

    // 错误处理
    server.on('error', (err) => {
      console.error('服务端启动错误:', err);
    });

    // 优雅关闭
    process.on('SIGINT', () => {
      console.log('正在关闭服务端...');
      server.kill();
      process.exit(0);
    });
  } else {
    console.error('依赖安装失败');
    process.exit(1);
  }
});
`;

fs.writeFileSync(path.join(serverDir, 'start.js'), serverStartScript);

// 创建服务端package.json用于生产环境
const serverPackageJson = {
  "name": "minecraft-server-panel-server",
  "version": "1.0.0",
  "description": "Minecraft服务器面板服务端",
  "main": "start.js",
  "scripts": {
    "start": "node start.js"
  }
};

fs.writeFileSync(path.join(serverDir, 'package.json'), JSON.stringify(serverPackageJson, null, 2));

// 创建 Windows 启动脚本
const serverStartBat = `@echo off
cd /d %~dp0
echo 正在启动服务端...
node start.js
pause`;

fs.writeFileSync(path.join(serverDir, 'start.bat'), serverStartBat);

// 创建 Linux/macOS 启动脚本
const serverStartSh = `#!/bin/bash
cd "$(dirname "$0")"
echo "正在启动服务端..."
node start.js`;

fs.writeFileSync(path.join(serverDir, 'start.sh'), serverStartSh);
// 给予执行权限 (在Linux/macOS中)
try {
  fs.chmodSync(path.join(serverDir, 'start.sh'), 0o755);
} catch (err) {
  // 忽略错误，因为在Windows上可能会失败
}

console.log('分体式包创建完成！');
console.log('客户端发布目录:', clientDir);
console.log('服务端发布目录:', serverDir);

// 同步复制目录的辅助函数（排除指定目录）
function copyDirSync(src, dest, options = {}) {
  const exclude = options.exclude || [];
  
  // 创建目标目录
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  // 读取源目录内容
  const items = fs.readdirSync(src);
  
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    // 检查是否应该排除
    if (exclude.includes(item)) {
      return; // 跳过此项目
    }
    
    const stats = fs.statSync(srcPath);
    
    if (stats.isDirectory()) {
      // 递归复制目录
      copyDirSync(srcPath, destPath, options);
    } else {
      // 复制文件
      fs.copyFileSync(srcPath, destPath);
    }
  });
}