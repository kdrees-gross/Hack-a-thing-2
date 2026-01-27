import { View, Text, FlatList, Pressable, Switch } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { AvailabilityBlock } from '@/types/user';

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
  applications?: Application[];
};

function checkJobMatchesAvailability(job: Job, availability: AvailabilityBlock[]): boolean {
  if (availability.length === 0) return false;

  const jobDate = new Date(job.date);
  const jobDayOfWeek = jobDate.getDay();

  return availability.some(block => {
    if (block.dayOfWeek !== jobDayOfWeek) return false;

    const jobStart = job.startTime;
    const jobEnd = job.endTime;
    const blockStart = block.startTime;
    const blockEnd = block.endTime;

    return jobStart >= blockStart && jobEnd <= blockEnd;
  });
}

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [availability, setAvailability] = useState<AvailabilityBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyMatching, setShowOnlyMatching] = useState(false);

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

  const fetchAvailability = useCallback(() => {
    if (user?.id) {
      fetch(`http://127.0.0.1:4000/users/${user.id}/availability`)
        .then((res) => res.json())
        .then((data) => setAvailability(data.availability || []))
        .catch((err) => {
          console.error('Error fetching availability:', err);
        });
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchJobs();
      fetchAvailability();
    }, [fetchJobs, fetchAvailability])
  );

  if (loading) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Loading jobs…</Text>
      </View>
    );
  }

  const filteredJobs = showOnlyMatching
    ? jobs.filter(job => checkJobMatchesAvailability(job, availability))
    : jobs;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
        Available Jobs
      </Text>

      {availability.length > 0 && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          padding: 12,
          backgroundColor: '#f3f4f6',
          borderRadius: 8
        }}>
          <Text style={{ fontSize: 16 }}>
            Show only jobs matching my availability
          </Text>
          <Switch
            value={showOnlyMatching}
            onValueChange={setShowOnlyMatching}
          />
        </View>
      )}

      {filteredJobs.length === 0 && (
        <Text>
          {showOnlyMatching
            ? 'No jobs match your availability'
            : 'No jobs available yet'}
        </Text>
      )}

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const application = item.applications?.find(
            (a) => a.workerId === user?.id
          );

          const matchesAvailability = checkJobMatchesAvailability(item, availability);

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
                  borderRadius: 8,
                  marginBottom: 12,
                  backgroundColor: application
                    ? '#fef3c7'
                    : 'white',
                  borderColor: matchesAvailability ? '#16a34a' : '#d1d5db',
                  borderWidth: matchesAvailability ? 2 : 1,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '500' }}>
                      {item.title}
                    </Text>
                    <Text>{item.location}</Text>
                    <Text>{item.pay}</Text>
                    <Text style={{ marginTop: 4, color: '#4b5563' }}>
                      {item.date} • {item.startTime} - {item.endTime}
                    </Text>

                    {application && (
                      <Text style={{ marginTop: 8 }}>
                        {application.status === 'pending'
                          ? '⏳ Applied (pending)'
                          : '✅ Approved'}
                      </Text>
                    )}
                  </View>

                  {matchesAvailability && (
                    <View style={{
                      backgroundColor: '#16a34a',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 4,
                      marginLeft: 8
                    }}>
                      <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                        MATCH
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            </Link>
          );
        }}
      />
    </View>
  );
}
