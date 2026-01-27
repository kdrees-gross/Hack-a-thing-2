export type UserRole = 'worker' | 'poster';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  token: string;
}