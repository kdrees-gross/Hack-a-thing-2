export type UserRole = 'worker' | 'poster';

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
}