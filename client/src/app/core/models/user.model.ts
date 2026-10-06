export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  hunterName: string;
  role: Role;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
