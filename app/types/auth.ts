export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginSuccessResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LoginResult {
  success: boolean;
  error?: string;
}
