import authService from './authService';

// API基础URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ApiService {
  private socket: WebSocket | null = null;

  connectWebSocket() {
    const token = authService.getToken();
    const wsUrl = `${(import.meta.env.VITE_WS_URL || 'ws://localhost:4000').replace('http', 'ws')}`;
    
    // 如果有认证token，则添加到连接URL中
    const connectionUrl = token ? `${wsUrl}?token=${token}` : wsUrl;
    
    this.socket = new WebSocket(connectionUrl);

    this.socket.onopen = () => {
      console.log('WebSocket连接已建立');
    };

    this.socket.onmessage = (event) => {
      console.log('收到消息:', event.data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket连接已关闭');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket错误:', error);
    };
  }

  disconnectWebSocket() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  getApiBaseUrl(): string {
    return API_BASE_URL;
  }

  // 通用的认证请求方法
  async authenticatedFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = authService.getToken();
    
    // 添加认证头
    const headers = new Headers(options.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
  }
}

export default new ApiService();