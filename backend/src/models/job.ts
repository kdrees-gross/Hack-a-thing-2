// Developed with the assistance of Claude
export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  pay: string;
  postedBy: string;
  date: string; // ISO date format YYYY-MM-DD
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}