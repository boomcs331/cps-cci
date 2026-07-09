export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginUser {
  id: string;
  username: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE" | "LOCKED";
}

export interface LoginSuccessResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: string;
  user: LoginUser;
}

export interface LoginResult {
  success: true;
  data: LoginSuccessResponse;
}

export interface LoginError {
  success: false;
  message: string;
}
