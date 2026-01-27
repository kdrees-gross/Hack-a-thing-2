import { useEffect, useState } from 'react';

export type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  pay: string;
};

const API_URL = 'http://127.0.0.1:4000';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/jobs`)
      .then((res) => res.json())
      .then(setJobs)
      .finally(() => setLoading(false));
  }, []);

  return { jobs, loading };
}