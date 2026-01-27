export type UserRole = 'worker' | 'poster';

export interface AvailabilityBlock {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  token: string;
  availability?: AvailabilityBlock[];
}