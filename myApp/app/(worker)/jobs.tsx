import { View, Text, FlatList, Pressable, Switch, StyleSheet } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { AvailabilityBlock } from '@/types/user';
import { LinearGradient } from 'expo-linear-gradient';

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

  // Parse date properly to avoid timezone issues
  const [year, month, day] = job.date.split('-').map(Number);
  const jobDate = new Date(year, month - 1, day);
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
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

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

  // Filter out jobs that already have an approved worker
  const availableJobs = jobs.filter(job => {
    const hasApprovedWorker = job.applications?.some(app => app.status === 'approved');
    return !hasApprovedWorker;
  });

  const filteredJobs = showOnlyMatching
    ? availableJobs.filter(job => checkJobMatchesAvailability(job, availability))
    : availableJobs;

  // Sort jobs by date
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <LinearGradient
      colors={['#99f6e4', '#5eead4', '#2dd4bf']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Available Jobs</Text>
        <Text style={styles.instructions}>
          Browse and apply to jobs below. Jobs matching your availability are highlighted in green.
        </Text>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <View style={styles.sortButtons}>
            <Pressable
              onPress={() => setSortOrder('newest')}
              style={[styles.sortButton, sortOrder === 'newest' && styles.sortButtonActive]}
            >
              <Text style={[styles.sortButtonText, sortOrder === 'newest' && styles.sortButtonTextActive]}>
                Newest
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSortOrder('oldest')}
              style={[styles.sortButton, sortOrder === 'oldest' && styles.sortButtonActive]}
            >
              <Text style={[styles.sortButtonText, sortOrder === 'oldest' && styles.sortButtonTextActive]}>
                Oldest
              </Text>
            </Pressable>
          </View>
        </View>

        {availability.length > 0 && (
          <View style={styles.filterContainer}>
            <Text style={styles.filterText}>
              Show only jobs matching my availability
            </Text>
            <Switch
              value={showOnlyMatching}
              onValueChange={setShowOnlyMatching}
            />
          </View>
        )}

        {sortedJobs.length === 0 && (
          <Text style={styles.emptyText}>
            {showOnlyMatching
              ? 'No jobs match your availability'
              : 'No jobs available yet'}
          </Text>
        )}

        <FlatList
          data={sortedJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
          const application = item.applications?.find(
            (a) => a.workerId === user?.id
          );

          const matchesAvailability = checkJobMatchesAvailability(item, availability);

          return (
            <View
              style={[
                styles.jobCard,
                application && styles.jobCardApplied,
                matchesAvailability && styles.jobCardMatch,
              ]}
            >
              <Link
                href={{
                  pathname: '/(worker)/job/[id]',
                  params: { id: item.id },
                }}
                asChild
              >
                <Pressable style={styles.pressableContent}>
                  <View style={styles.jobCardContent}>
                    {matchesAvailability && (
                      <View style={styles.matchBadge}>
                        <Text style={styles.matchBadgeText}>MATCH</Text>
                      </View>
                    )}

                    {application && (
                      <Text style={[styles.jobStatus, styles.jobStatusApplied]}>
                        Applied (Pending)
                      </Text>
                    )}

                    <Text style={styles.jobTitle}>{item.title}</Text>
                    <Text style={styles.jobDetail}>{item.location}</Text>
                    <Text style={styles.jobDetail}>{item.pay}</Text>
                    <Text style={styles.jobDateTime}>
                      {item.date} • {item.startTime} - {item.endTime}
                    </Text>
                  </View>
                </Pressable>
              </Link>
            </View>
          );
        }}
      />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0f172a',
    textAlign: 'center',
  },
  instructions: {
    fontSize: 15,
    color: '#4b5563',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  sortContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: '#14b8a6',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  sortButtonTextActive: {
    color: 'white',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterText: {
    fontSize: 15,
    flex: 1,
    marginRight: 12,
    color: '#374151',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 32,
    fontSize: 16,
  },
  jobCard: {
    padding: 18,
    borderRadius: 10,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  jobCardApplied: {
    backgroundColor: '#ffffff',
    borderColor: '#f59e0b',
    borderWidth: 3,
  },
  jobCardMatch: {
    backgroundColor: '#ffffff',
    borderColor: '#10b981',
    borderWidth: 3,
  },
  pressableContent: {
    width: '100%',
  },
  jobCardContent: {
    flexDirection: 'column',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
  },
  jobDetail: {
    fontSize: 15,
    color: '#4b5563',
    marginBottom: 4,
  },
  jobDetailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  jobDetailText: {
    fontSize: 15,
    color: '#4b5563',
  },
  jobDateTime: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
    marginBottom: 4,
  },
  jobStatus: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 10,
    color: '#374151',
  },
  jobStatusApplied: {
    color: '#92400e',
  },
  jobStatusMatch: {
    color: '#065f46',
  },
  applicationStatus: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  applicationStatusText: {
    fontSize: 15,
    fontWeight: '600',
  },
  matchBadge: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  matchBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
