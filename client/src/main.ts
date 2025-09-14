import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 启动时连接WebSocket服务
import apiService from './services/api';
import authService from './services/authService';

// 检查用户是否已认证
if (authService.isAuthenticated()) {
  // 连接到WebSocket服务
  apiService.connectWebSocket();
}

createApp(App).mount('#app')