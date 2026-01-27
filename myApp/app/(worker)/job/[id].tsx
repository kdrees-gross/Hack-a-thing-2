import { View, Text, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function JobDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:4000/jobs`)
      .then(res => res.json())
      .then(jobs => setJob(jobs.find((j: any) => j.id === id)));
  }, [id]);

  if (!job) return <Text>Loading...</Text>;

  const application = job.applications?.find(
    (a: any) => a.workerId === user?.id
  );

  async function apply() {
    if (!user?.id) {
      alert('You must be logged in to apply');
      return;
    }

    await fetch(`http://127.0.0.1:4000/jobs/${id}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workerId: user.id }),
    });
    const res = await fetch(`http://127.0.0.1:4000/jobs`);
    const jobs = await res.json();
    setJob(jobs.find((j: any) => j.id === id));
  }

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24 }}>{job.title}</Text>
      <Text style={{ marginTop: 8 }}>{job.description}</Text>
      <Text style={{ marginTop: 8 }}>Location: {job.location}</Text>
      <Text>Pay: {job.pay}</Text>
      <Text style={{ marginTop: 8, fontWeight: '600' }}>
        {job.date} • {job.startTime} - {job.endTime}
      </Text>

      {!application && (
        <Pressable onPress={apply} style={{ marginTop: 16, padding: 12, backgroundColor: '#2563eb', borderRadius: 6 }}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Apply</Text>
        </Pressable>
      )}

      {application?.status === 'pending' && (
        <Text style={{ marginTop: 16 }}>⏳ Pending approval</Text>
      )}

      {application?.status === 'approved' && (
        <Text style={{ marginTop: 16 }}>✅ Approved</Text>
      )}
    </View>
  );
}
