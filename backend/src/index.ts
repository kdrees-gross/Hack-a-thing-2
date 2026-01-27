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
  const { title, description, location, pay } = req.body;

  const job: Job = {
    id: randomUUID(),
    title,
    description,
    location,
    pay,
    applications: [],
  };

  jobs.push(job);
  res.status(201).json(job);
});

app.post('/jobs/:id/apply', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).send('Job not found');

  const alreadyApplied = job.applications.some(
    a => a.workerId === 'worker1'
  );

  if (!alreadyApplied) {
    job.applications.push({
      workerId: 'worker1',
      status: 'pending',
    });
  }

  res.json(job);
});

app.post('/jobs/:id/approve', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).send('Job not found');

  const application = job.applications.find(
    a => a.workerId === 'worker1'
  );

  if (!application) {
    return res.status(400).send('No application to approve');
  }

  application.status = 'approved';

  res.json(job);
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

const PORT = 4000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Backend listening on http://127.0.0.1:${PORT}`);
});