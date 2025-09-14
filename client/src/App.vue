<script setup lang="ts">
import { ref, onMounted } from 'vue'
import authService from './services/authService'
import apiService from './services/api'

const isConnected = ref(false)
const isLoggedIn = ref(false)
const user = ref<any>(null)

onMounted(() => {
  // 检查用户登录状态
  isLoggedIn.value = authService.isAuthenticated();
  if (isLoggedIn.value) {
    user.value = authService.getUser();
    // 连接WebSocket
    apiService.connectWebSocket();
    isConnected.value = true;
  }
});

const handleLogin = async () => {
  try {
    // 这里应该是一个登录表单
    // 示例代码：
    // await authService.login({ username: 'test', password: 'password' });
    // isLoggedIn.value = true;
    // user.value = authService.getUser();
    // apiService.connectWebSocket();
    // isConnected.value = true;
  } catch (error) {
    console.error('登录失败:', error);
  }
};

const handleLogout = () => {
  authService.logout();
  isLoggedIn.value = false;
  user.value = null;
  apiService.disconnectWebSocket();
  isConnected.value = false;
};
</script>

<template>
  <div>
    <header>
      <h1>Minecraft Server Panel</h1>
      <div class="header-actions">
        <div class="connection-status" v-if="isLoggedIn">
          <span class="status-indicator" :class="{ connected: isConnected }"></span>
          {{ isConnected ? '已连接' : '未连接' }}
        </div>
        <div class="user-info" v-if="isLoggedIn">
          <span>欢迎, {{ user?.username }}!</span>
          <button @click="handleLogout">登出</button>
        </div>
        <div v-else>
          <button @click="handleLogin">登录</button>
        </div>
      </div>
    </header>
    
    <main>
      <div class="container">
        <h2 v-if="!isLoggedIn">请登录以管理您的Minecraft服务器</h2>
        <div v-else>
          <h2>欢迎使用 Minecraft Server Panel</h2>
          <p>这是一个现代化的Minecraft服务器管理面板。</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #2c3e50;
  color: white;
  
  h1 {
    margin: 0;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .connection-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #e74c3c;
    
    &.connected {
      background-color: #2ecc71;
    }
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #2980b9;
    }
  }
}

main {
  padding: 2rem;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>