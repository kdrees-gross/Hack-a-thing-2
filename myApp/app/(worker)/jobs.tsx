import { View, Text, FlatList, Pressable } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

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
  applications?: Application[];
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(() => {
    setLoading(true);
    fetch('http://127.0.0.1:4000/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => {
        console.error('Error fetching jobs:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ Re-fetch jobs whenever this tab is focused
  useFocusEffect(fetchJobs);

  if (loading) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Loading jobs…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
        Available Jobs
      </Text>

      {jobs.length === 0 && (
        <Text>No jobs available yet</Text>
      )}

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const application = item.applications?.find(
            (a) => a.workerId === 'worker1'
          );

          return (
            <Link
              href={{
                pathname: '/(worker)/job/[id]',
                params: { id: item.id },
              }}
              asChild
            >
              <Pressable
                style={{
                  padding: 16,
                  borderWidth: 1,
                  borderRadius: 8,
                  marginBottom: 12,
                  backgroundColor: application
                    ? '#fef3c7'
                    : 'white',
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: '500' }}>
                  {item.title}
                </Text>
                <Text>{item.location}</Text>
                <Text>{item.pay}</Text>

                {application && (
                  <Text style={{ marginTop: 8 }}>
                    {application.status === 'pending'
                      ? '⏳ Applied (pending)'
                      : '✅ Approved'}
                  </Text>
                )}
              </Pressable>
            </Link>
          );
        }}
      />
    </View>
  );
}