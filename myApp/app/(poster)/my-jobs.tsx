import { View, Text, Pressable, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

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

export default function MyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = () => {
    setLoading(true);
    fetch('http://127.0.0.1:4000/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .finally(() => setLoading(false));
  };

  useFocusEffect(
    useCallback(() => {
      fetchJobs();
    }, [])
  );

const approve = async (jobId: string) => {
  await fetch(`http://127.0.0.1:4000/jobs/${jobId}/approve`, {
    method: 'POST',
  });
  fetchJobs(); // ✅ re-fetch after approve
};

  if (loading) {
    return <Text style={{ padding: 16 }}>Loading…</Text>;
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
        My Posted Jobs
      </Text>

      {jobs.length === 0 && (
        <Text>No jobs posted yet</Text>
      )}

      {jobs.map((job) => (
        <View
          key={job.id}
          style={{
            borderWidth: 1,
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '500' }}>
            {job.title}
          </Text>
          <Text>{job.location}</Text>
          <Text>{job.pay}</Text>

          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: '600' }}>
              Applications:
            </Text>

            {job.applications.length === 0 && (
              <Text>No applications yet</Text>
            )}

            {job.applications.map((app, index) => (
              <View key={index} style={{ marginTop: 8 }}>
                <Text>Worker: {app.workerId}</Text>
                <Text>Status: {app.status}</Text>

                {app.status === 'pending' && (
                  <Pressable
                    onPress={() => approve(job.id)}
                    style={{
                      marginTop: 8,
                      padding: 8,
                      backgroundColor: '#16a34a',
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: 'white' }}>
                      Approve
                    </Text>
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}