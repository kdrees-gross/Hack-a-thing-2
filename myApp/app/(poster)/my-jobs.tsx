import { View, Text, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
  postedBy: string;
  applications: Application[];
};

export default function MyJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

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

  // Sort jobs by date
  const sortedJobs = [...jobs].sort((a, b) => {
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
      <ScrollView style={styles.content}>
        <Text style={styles.title}>
          My Posted Jobs
        </Text>
        <Text style={styles.instructions}>
          View your posted jobs and approve worker applications below.
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

        {sortedJobs.length === 0 && (
          <Text style={styles.emptyText}>No jobs posted yet</Text>
        )}

        {sortedJobs.map((job) => {
          const hasApprovedWorker = job.applications.some(
            (a) => a.status === 'approved'
          );

          return (
            <View
              key={job.id}
              style={[
                styles.jobCard,
                hasApprovedWorker && styles.jobCardFilled
              ]}
            >
              <View style={styles.jobHeader}>
                <View style={styles.jobInfo}>
                  {hasApprovedWorker && (
                    <View style={styles.filledBadge}>
                      <Text style={styles.filledBadgeText}>FILLED</Text>
                    </View>
                  )}
                  <Text style={styles.jobTitle}>
                    {job.title}
                  </Text>
                  <Text style={styles.jobDetail}>{job.location}</Text>
                  <Text style={styles.jobDetail}>{job.pay}</Text>
                  <Text style={styles.jobDateTime}>
                    {job.date} • {job.startTime} - {job.endTime}
                  </Text>
                </View>

                <Pressable
                  onPress={() => deleteJob(job.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>

              <View style={styles.applicationsSection}>
                <Text style={styles.applicationsTitle}>
                  Applications:
                </Text>

                {job.applications.length === 0 && (
                  <Text style={styles.noApplicationsText}>No applications yet</Text>
                )}

                {job.applications.map((app, index) => (
                  <View key={index} style={styles.applicationItem}>
                    <Text style={styles.applicationText}>Worker: {app.workerId}</Text>
                    <Text style={styles.applicationText}>
                      Status: <Text style={app.status === 'approved' ? styles.statusApproved : styles.statusPending}>
                        {app.status}
                      </Text>
                    </Text>

                    {app.status === 'pending' && !hasApprovedWorker && (
                      <Pressable
                        onPress={() => approve(job.id, app.workerId)}
                        style={styles.approveButton}
                      >
                        <Text style={styles.approveButtonText}>
                          Approve
                        </Text>
                      </Pressable>
                    )}
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
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
  emptyText: {
    color: '#6b7280',
    fontSize: 16,
  },
  jobCard: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobCardFilled: {
    backgroundColor: '#d1fae5',
    borderColor: '#6ee7b7',
  },
  filledBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  filledBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
    paddingRight: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#111827',
  },
  jobDetail: {
    fontSize: 15,
    color: '#4b5563',
    marginBottom: 2,
  },
  jobDateTime: {
    marginTop: 4,
    fontSize: 14,
    color: '#6b7280',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#dc2626',
    borderRadius: 6,
    marginLeft: 8,
    marginTop: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  applicationsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  applicationsTitle: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 16,
    color: '#111827',
  },
  noApplicationsText: {
    color: '#6b7280',
    fontSize: 14,
  },
  applicationItem: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  applicationText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  statusApproved: {
    color: '#16a34a',
    fontWeight: '600',
  },
  statusPending: {
    color: '#f59e0b',
    fontWeight: '600',
  },
  approveButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#16a34a',
    borderRadius: 6,
  },
  approveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});
