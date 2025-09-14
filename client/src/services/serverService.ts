import apiService from './api';

interface ServerConfig {
  host: string;
  port: number;
  token: string;
}

interface ServerStatus {
  connected: boolean;
  status: string;
  players: number;
  maxPlayers: number;
}

class ServerService {
  // 获取服务端配置
  async getServerConfig(): Promise<ServerConfig> {
    const response = await apiService.authenticatedFetch('/api/server/config');
    return await response.json();
  }

  // 更新服务端配置
  async updateServerConfig(config: Partial<ServerConfig>): Promise<any> {
    const response = await apiService.authenticatedFetch('/api/server/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    return await response.json();
  }

  // 获取服务端状态
  async getServerStatus(): Promise<ServerStatus> {
    const response = await apiService.authenticatedFetch('/api/server/status');
    return await response.json();
  }

  // 发送命令到服务端
  async sendCommand(command: string): Promise<any> {
    const response = await apiService.authenticatedFetch('/api/server/command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    return await response.json();
  }
}

export default new ServerService();