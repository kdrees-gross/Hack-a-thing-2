// Developed with the assistance of Dartmouth ChatGPT
import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from './models/user';

const JWT_SECRET = 'dev-secret'; // 🔴 env var later

const users: User[] = [];

const app = express();
app.use(cors());
app.use(express.json());

type Application = {
  workerId: string;
  status: 'pending' | 'approved';
};

type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  pay: string;
  postedBy: string;
  date: string;
  startTime: string;
  endTime: string;
  applications: Application[];
};

// ✅ SINGLE shared in‑memory store
const jobs: Job[] = [];

app.get('/', (_req, res) => {
  res.send('Backend running ✅');
});

app.get('/jobs', (_req, res) => {
  res.json(jobs);
});

app.post('/jobs', (req, res) => {
  const { title, description, location, pay, postedBy, date, startTime, endTime } = req.body;

  const job: Job = {
    id: randomUUID(),
    title,
    description,
    location,
    pay,
    postedBy,
    date,
    startTime,
    endTime,
    applications: [],
  };

  jobs.push(job);
  res.status(201).json(job);
});

app.post('/jobs/:id/apply', (req, res) => {
  const { workerId } = req.body;
  const job = jobs.find(j => j.id === req.params.id);

  if (!job) return res.status(404).send('Job not found');
  if (!workerId) return res.status(400).send('Worker ID required');

  const alreadyApplied = job.applications.some(
    a => a.workerId === workerId
  );

  if (!alreadyApplied) {
    job.applications.push({
      workerId,
      status: 'pending',
    });
  }

  res.json(job);
});

app.post('/jobs/:id/approve', (req, res) => {
  const { workerId } = req.body;
  const job = jobs.find(j => j.id === req.params.id);

  if (!job) return res.status(404).send('Job not found');
  if (!workerId) return res.status(400).send('Worker ID required');

  // Check if there's already an approved worker
  const hasApprovedWorker = job.applications.some(a => a.status === 'approved');
  if (hasApprovedWorker) {
    return res.status(400).send('This job already has an approved worker');
  }

  const application = job.applications.find(
    a => a.workerId === workerId
  );

  if (!application) {
    return res.status(400).send('No application to approve');
  }

  application.status = 'approved';

  res.json(job);
});

// DELETE /jobs/:id
app.delete('/jobs/:id', (req, res) => {
  const index = jobs.findIndex(j => j.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Job not found' });
  }

  jobs.splice(index, 1);
  res.status(204).send();
});

app.post('/auth/signup', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const existing = users.find(u => u.username === username);
  if (existing) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user: User = {
    id: randomUUID(),
    username,
    passwordHash,
    role,
  };

  users.push(user);

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role },
  });
});

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role },
  });
});

// GET /users/:userId/availability
app.get('/users/:userId/availability', (req, res) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ availability: user.availability || [] });
});

// PUT /users/:userId/availability
app.put('/users/:userId/availability', (req, res) => {
  const user = users.find(u => u.id === req.params.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { availability } = req.body;
  user.availability = availability;

  res.json({ availability: user.availability });
});

const PORT = 4000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Backend listening on http://127.0.0.1:${PORT}`);
});