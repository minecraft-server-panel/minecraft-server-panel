import apiService from './api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
}

interface User {
  id: number;
  username: string;
}

interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${apiService.getApiBaseUrl()}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data: AuthResponse = await response.json();

    if (response.ok) {
      this.token = data.token;
      this.user = data.user;
      // 保存token到localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${apiService.getApiBaseUrl()}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData: AuthResponse = await response.json();

    if (response.ok) {
      this.token = responseData.token;
      this.user = responseData.user;
      // 保存token到localStorage
      localStorage.setItem('authToken', responseData.token);
      localStorage.setItem('user', JSON.stringify(responseData.user));
    }

    return responseData;
  }

  logout(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    if (!this.token) {
      // 尝试从localStorage获取token
      this.token = localStorage.getItem('authToken');
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          this.user = JSON.parse(userString);
        } catch (e) {
          // 解析失败，清除无效数据
          localStorage.removeItem('user');
        }
      }
    }

    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  // 获取用户偏好设置
  async getUserPreferences(): Promise<any> {
    if (!this.token) {
      throw new Error('用户未认证');
    }

    const response = await fetch(`${apiService.getApiBaseUrl()}/api/user/preferences`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    return await response.json();
  }

  // 更新用户偏好设置
  async updateUserPreferences(preferences: any): Promise<any> {
    if (!this.token) {
      throw new Error('用户未认证');
    }

    const response = await fetch(`${apiService.getApiBaseUrl()}/api/user/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify(preferences),
    });

    return await response.json();
  }
}

export default new AuthService();