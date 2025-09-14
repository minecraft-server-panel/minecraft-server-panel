const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('开始创建一体化包...');

// 创建发布目录
const releaseDir = path.join(__dirname, 'release', 'all-in-one');

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

// 复制客户端源文件（排除node_modules和dist）
const clientSrc = path.join(__dirname, '..', 'client');
const clientRelease = path.join(releaseDir, 'client');
copyDirSync(clientSrc, clientRelease, { exclude: ['node_modules', 'dist'] });

// 复制客户端后端源文件（排除node_modules和dist）
const clientServerSrc = path.join(__dirname, '..', 'client', 'server');
const clientServerRelease = path.join(releaseDir, 'client-server');
copyDirSync(clientServerSrc, clientServerRelease, { exclude: ['node_modules', 'dist'] });

// 复制服务端源文件（排除node_modules和dist）
const serverSrc = path.join(__dirname, '..', 'server');
const serverRelease = path.join(releaseDir, 'server');
copyDirSync(serverSrc, serverRelease, { exclude: ['node_modules', 'dist'] });

// 创建统一启动脚本
const startScript = `
const { spawn } = require('child_process');
const path = require('path');

console.log('启动一体化Minecraft Server Panel...');

// 安装依赖
console.log('正在安装客户端依赖...');
const clientInstall = spawn('pnpm', ['install'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit'
});

clientInstall.on('close', (code) => {
  if (code === 0) {
    console.log('正在安装客户端后端依赖...');
    const clientServerInstall = spawn('pnpm', ['install'], {
      cwd: path.join(__dirname, 'client-server'),
      stdio: 'inherit'
    });

    clientServerInstall.on('close', (code) => {
      if (code === 0) {
        console.log('正在安装服务端依赖...');
        const serverInstall = spawn('pnpm', ['install'], {
          cwd: path.join(__dirname, 'server'),
          stdio: 'inherit'
        });

        serverInstall.on('close', (code) => {
          if (code === 0) {
            // 启动客户端服务器 (端口 3000)
            const client = spawn('npx', ['vite', 'preview', '--port', '3000', '--host'], {
              cwd: path.join(__dirname, 'client'),
              stdio: 'inherit'
            });

            // 启动客户端后端服务器 (端口 4000)
            const clientServer = spawn('npm', ['run', 'start'], {
              cwd: path.join(__dirname, 'client-server'),
              stdio: 'inherit'
            });

            // 启动服务端服务器 (端口 5000)
            const server = spawn('npm', ['run', 'start'], {
              cwd: path.join(__dirname, 'server'),
              stdio: 'inherit'
            });

            // 错误处理
            client.on('error', (err) => {
              console.error('客户端启动错误:', err);
            });

            clientServer.on('error', (err) => {
              console.error('客户端后端启动错误:', err);
            });

            server.on('error', (err) => {
              console.error('服务端启动错误:', err);
            });

            // 优雅关闭
            process.on('SIGINT', () => {
              console.log('正在关闭所有服务...');
              client.kill();
              clientServer.kill();
              server.kill();
              process.exit(0);
            });
          } else {
            console.error('服务端依赖安装失败');
            process.exit(1);
          }
        });
      } else {
        console.error('客户端后端依赖安装失败');
        process.exit(1);
      }
    });
  } else {
    console.error('客户端依赖安装失败');
    process.exit(1);
  }
});
`;

fs.writeFileSync(path.join(releaseDir, 'start.js'), startScript);

// 创建package.json用于生产环境
const packageJson = {
  "name": "minecraft-server-panel-all-in-one",
  "version": "1.0.0",
  "description": "一体化Minecraft服务器面板",
  "main": "start.js",
  "scripts": {
    "start": "node start.js"
  },
  "dependencies": {
    "vite": "^4.3.9"
  }
};

fs.writeFileSync(path.join(releaseDir, 'package.json'), JSON.stringify(packageJson, null, 2));

// 创建 Windows 启动脚本
const startBat = `@echo off
cd /d %~dp0
echo 正在启动一体化Minecraft Server Panel...
node start.js
pause`;

fs.writeFileSync(path.join(releaseDir, 'start.bat'), startBat);

// 创建 Linux/macOS 启动脚本
const startSh = `#!/bin/bash
cd "$(dirname "$0")"
echo "正在启动一体化Minecraft Server Panel..."
node start.js`;

fs.writeFileSync(path.join(releaseDir, 'start.sh'), startSh);
// 给予执行权限 (在Linux/macOS中)
try {
  fs.chmodSync(path.join(releaseDir, 'start.sh'), 0o755);
} catch (err) {
  // 忽略错误，因为在Windows上可能会失败
}

// 复制配置文件
const envFiles = [
  path.join(__dirname, '..', 'client', '.env'),
  path.join(__dirname, '..', 'client', 'server', '.env'),
  path.join(__dirname, '..', 'server', '.env')
];

envFiles.forEach(envFile => {
  if (fs.existsSync(envFile)) {
    const fileName = path.basename(envFile);
    fs.copyFileSync(envFile, path.join(releaseDir, fileName));
  }
});

console.log('一体化包创建完成！');
console.log('发布目录:', releaseDir);

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