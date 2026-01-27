import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';

export default function Profile() {
  const [approvedJobs, setApprovedJobs] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:4000/jobs')
      .then((res) => res.json())
      .then((jobs) =>
        setApprovedJobs(
          jobs.filter((job: any) =>
            job.applications?.some(
              (a: any) =>
                a.workerId === 'worker1' && a.status === 'approved'
            )
          )
        )
      );
  }, []);

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
        My Approved Jobs
      </Text>

      {approvedJobs.length === 0 && (
        <Text>No approved jobs yet</Text>
      )}

      {approvedJobs.map((job) => (
        <Text key={job.id}>✅ {job.title}</Text>
      ))}
    </View>
  );
}