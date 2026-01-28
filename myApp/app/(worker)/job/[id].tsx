import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
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

  if (!job) return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;

  const application = job.applications?.find(
    (a: any) => a.workerId === user?.id
  );

  const hasApprovedWorker = job.applications?.some(
    (a: any) => a.status === 'approved'
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{job.title}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{job.location}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Pay</Text>
              <Text style={styles.detailValue}>
                {job.pay.startsWith('$') ? job.pay : `$${job.pay}`}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>
                {job.date} • {job.startTime} - {job.endTime}
              </Text>
            </View>
          </View>
        </View>

        {hasApprovedWorker && !application && (
          <View style={styles.statusFilled}>
            <Text style={styles.statusFilledText}>This position has been filled</Text>
          </View>
        )}

        {!application && !hasApprovedWorker && (
          <Pressable onPress={apply} style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply for this Job</Text>
          </Pressable>
        )}

        {application?.status === 'pending' && (
          <View style={styles.statusPending}>
            <Text style={styles.statusPendingText}>Application Pending</Text>
            <Text style={styles.statusSubtext}>Waiting for employer approval</Text>
          </View>
        )}

        {application?.status === 'approved' && (
          <View style={styles.statusApproved}>
            <Text style={styles.statusApprovedText}>Application Approved</Text>
            <Text style={styles.statusSubtext}>You've been selected for this job!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccfbf1',
  },
  content: {
    padding: 20,
  },
  loading: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#6b7280',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#2563eb',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusFilled: {
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  statusFilledText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991b1b',
    textAlign: 'center',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  statusPendingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400e',
    textAlign: 'center',
    marginBottom: 4,
  },
  statusApproved: {
    backgroundColor: '#d1fae5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6ee7b7',
  },
  statusApprovedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#065f46',
    textAlign: 'center',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
