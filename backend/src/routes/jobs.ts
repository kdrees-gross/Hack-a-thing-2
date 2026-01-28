// Developed with the assistance of Claude
import { Router } from 'express';
import { Job } from '../models/job';
import { randomUUID } from 'crypto';

const router = Router();

// 🔴 temporary in-memory store
const jobs: Job[] = [];

// GET /jobs
router.get('/', (_req, res) => {
  res.json(jobs);
});

// POST /jobs
router.post('/', (req, res) => {
  const { title, description, location, pay, date, startTime, endTime, postedBy } = req.body;

  const newJob: Job = {
    id: randomUUID(),
    title,
    description,
    location,
    pay,
    postedBy,
    date,
    startTime,
    endTime,
  };

  jobs.push(newJob);
  res.status(201).json(newJob);
});

// DELETE /jobs/:id
router.delete('/:id', (req, res) => {
  const index = jobs.findIndex(j => j.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Job not found' });
  }

  jobs.splice(index, 1);
  res.status(204).send();
});

export default router;