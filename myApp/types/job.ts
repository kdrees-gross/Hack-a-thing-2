export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  postedBy: string;
  approvedWorkerId?: string;
}