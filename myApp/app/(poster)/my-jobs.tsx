import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

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
  date: string;
  startTime: string;
  endTime: string;
  postedBy: string;
  applications: Application[];
};

export default function MyJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = () => {
    setLoading(true);
    fetch('http://127.0.0.1:4000/jobs')
      .then((res) => res.json())
      .then((data) => {
        // Filter to only show jobs posted by current user
        const myJobs = data.filter((job: Job) => job.postedBy === user?.id);
        setJobs(myJobs);
      })
      .finally(() => setLoading(false));
  };

  useFocusEffect(
    useCallback(() => {
      fetchJobs();
    }, [user?.id])
  );

  const approve = async (jobId: string, workerId: string) => {
    await fetch(`http://127.0.0.1:4000/jobs/${jobId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workerId }),
    });
    fetchJobs();
  };

  const deleteJob = (jobId: string) => {
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await fetch(`http://127.0.0.1:4000/jobs/${jobId}`, {
                method: 'DELETE',
              });
              fetchJobs();
            } catch (err) {
              alert('Error deleting job');
              console.error(err);
            }
          },
        },
      ]
    );
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '500' }}>
                {job.title}
              </Text>
              <Text>{job.location}</Text>
              <Text>{job.pay}</Text>
              <Text style={{ marginTop: 4, color: '#4b5563' }}>
                {job.date} • {job.startTime} - {job.endTime}
              </Text>
            </View>

            <Pressable
              onPress={() => deleteJob(job.id)}
              style={{
                padding: 8,
                backgroundColor: '#dc2626',
                borderRadius: 4,
                marginLeft: 8,
              }}
            >
              <Text style={{ color: 'white', fontSize: 12 }}>Delete</Text>
            </Pressable>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: '600' }}>
              Applications:
            </Text>

            {job.applications.length === 0 && (
              <Text>No applications yet</Text>
            )}

            {(() => {
              const hasApprovedWorker = job.applications.some(
                (a) => a.status === 'approved'
              );

              return job.applications.map((app, index) => (
                <View key={index} style={{ marginTop: 8 }}>
                  <Text>Worker: {app.workerId}</Text>
                  <Text>Status: {app.status}</Text>

                  {app.status === 'pending' && !hasApprovedWorker && (
                    <Pressable
                      onPress={() => approve(job.id, app.workerId)}
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
              ));
            })()}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
