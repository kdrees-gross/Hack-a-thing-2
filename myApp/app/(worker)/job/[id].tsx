import { View, Text, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function JobDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:4000/jobs`)
      .then(res => res.json())
      .then(jobs => setJob(jobs.find((j: any) => j.id === id)));
  }, [id]);

  if (!job) return <Text>Loading...</Text>;

const application = job.applications?.find(
  (a: any) => a.workerId === 'worker1'
);
  async function apply() {
    await fetch(`http://127.0.0.1:4000/jobs/${id}/apply`, { method: 'POST' });
    const res = await fetch(`http://127.0.0.1:4000/jobs`);
    const jobs = await res.json();
    setJob(jobs.find((j: any) => j.id === id));
  }

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24 }}>{job.title}</Text>
      <Text>{job.description}</Text>

      {!application && (
  <Pressable onPress={apply}>
    <Text>Apply</Text>
  </Pressable>
)}

{application?.status === 'pending' && (
  <Text>⏳ Pending approval</Text>
)}

{application?.status === 'approved' && (
  <Text>✅ Approved</Text>
)}
    </View>
  );
}