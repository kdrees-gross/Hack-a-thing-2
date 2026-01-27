import { Router } from 'express';
import { Job } from '../models/job';
import { randomUUID } from 'crypto';

const router = Router();

// 🔴 temporary in-memory store
const jobs: Job[] = [
  {
    id: '1',
    title: 'Clean garage',
    description: 'Clean out a 2-car garage',
    location: 'Boston',
    pay: '$50',
    postedBy: 'poster1',
  },
];

// GET /jobs
router.get('/', (_req, res) => {
  res.json(jobs);
});

// POST /jobs
router.post('/', (req, res) => {
  const { title, description, location, pay } = req.body;

  const newJob: Job = {
    id: randomUUID(),
    title,
    description,
    location,
    pay,
    postedBy: 'poster1',
  };

  jobs.push(newJob);
  res.status(201).json(newJob);
});

export default router;