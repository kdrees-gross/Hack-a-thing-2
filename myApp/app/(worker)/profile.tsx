import { View, Text, ScrollView, Pressable, Platform, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { AvailabilityBlock } from '@/types/user';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Profile() {
  const { user } = useAuth();
  const [approvedJobs, setApprovedJobs] = useState<any[]>([]);
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [availability, setAvailability] = useState<AvailabilityBlock[]>([]);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState<number | null>(null);
  const [showEndTimePicker, setShowEndTimePicker] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:4000/jobs')
      .then((res) => res.json())
      .then((jobs) => {
        setApprovedJobs(
          jobs.filter((job: any) =>
            job.applications?.some(
              (a: any) =>
                a.workerId === user?.id && a.status === 'approved'
            )
          )
        );
        setPendingJobs(
          jobs.filter((job: any) =>
            job.applications?.some(
              (a: any) =>
                a.workerId === user?.id && a.status === 'pending'
            )
          )
        );
      });

    if (user?.id) {
      fetch(`http://127.0.0.1:4000/users/${user.id}/availability`)
        .then((res) => res.json())
        .then((data) => setAvailability(data.availability || []))
        .catch((err) => console.error('Error fetching availability:', err));
    }
  }, [user?.id]);

  const addAvailabilityBlock = () => {
    setAvailability([...availability, { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }]);
  };

  const removeAvailabilityBlock = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const updateAvailabilityBlock = (index: number, field: keyof AvailabilityBlock, value: string | number) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  };

  const timeToDate = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const saveAvailability = async () => {
    console.log('Save button pressed');
    console.log('User ID:', user?.id);
    console.log('Availability to save:', availability);

    if (!user?.id) {
      alert('You must be logged in to save availability');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:4000/users/${user.id}/availability`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Failed to save availability');
      }

      alert('Availability saved!');
      setIsEditingAvailability(false);
    } catch (err) {
      console.error('Save error:', err);
      alert('Error saving availability: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  return (
    <LinearGradient
      colors={['#99f6e4', '#5eead4', '#2dd4bf']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.sectionTitle}>
        My Availability
      </Text>
        <Text style={styles.instructions}>
          Set your weekly availability so posters can find you for jobs that match your schedule.
        </Text>

      {!isEditingAvailability && (
        <>
          {availability.length === 0 ? (
            <Text style={styles.emptyText}>No availability set</Text>
          ) : (
            availability.map((block, index) => (
              <View key={index} style={styles.availabilityBlock}>
                <Text style={styles.availabilityText}>
                  {DAYS[block.dayOfWeek]}: {block.startTime} - {block.endTime}
                </Text>
              </View>
            ))
          )}
          <Pressable
            onPress={() => setIsEditingAvailability(true)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>
              {availability.length === 0 ? 'Set Availability' : 'Edit Availability'}
            </Text>
          </Pressable>
        </>
      )}

      {isEditingAvailability && (
        <View>
          {availability.map((block, index) => (
            <View key={index} style={styles.editBlock}>
              <Text style={styles.blockTitle}>Block {index + 1}</Text>

              <Text style={styles.label}>Day of Week:</Text>
              <View style={styles.dayButtons}>
                {DAYS.map((day, dayIndex) => (
                  <Pressable
                    key={dayIndex}
                    onPress={() => updateAvailabilityBlock(index, 'dayOfWeek', dayIndex)}
                    style={[
                      styles.dayButton,
                      block.dayOfWeek === dayIndex && styles.dayButtonActive
                    ]}
                  >
                    <Text style={[
                      styles.dayButtonText,
                      block.dayOfWeek === dayIndex && styles.dayButtonTextActive
                    ]}>
                      {day.slice(0, 3)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.label}>Start Time:</Text>
              <Pressable
                onPress={() => setShowStartTimePicker(index)}
                style={styles.timePickerButton}
              >
                <Text style={styles.timePickerText}>{block.startTime}</Text>
              </Pressable>
              {showStartTimePicker === index && (
                <DateTimePicker
                  value={timeToDate(block.startTime)}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minuteInterval={15}
                  onChange={(_event: DateTimePickerEvent, selectedTime?: Date) => {
                    setShowStartTimePicker(Platform.OS === 'ios' ? index : null);
                    if (selectedTime) {
                      updateAvailabilityBlock(index, 'startTime', formatTime(selectedTime));
                    }
                  }}
                />
              )}

              <Text style={styles.label}>End Time:</Text>
              <Pressable
                onPress={() => setShowEndTimePicker(index)}
                style={styles.timePickerButton}
              >
                <Text style={styles.timePickerText}>{block.endTime}</Text>
              </Pressable>
              {showEndTimePicker === index && (
                <DateTimePicker
                  value={timeToDate(block.endTime)}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minuteInterval={15}
                  onChange={(_event: DateTimePickerEvent, selectedTime?: Date) => {
                    setShowEndTimePicker(Platform.OS === 'ios' ? index : null);
                    if (selectedTime) {
                      updateAvailabilityBlock(index, 'endTime', formatTime(selectedTime));
                    }
                  }}
                />
              )}

              <Pressable
                onPress={() => removeAvailabilityBlock(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </Pressable>
            </View>
          ))}

          <Pressable
            onPress={addAvailabilityBlock}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add Time Block</Text>
          </Pressable>

          <View style={styles.actionButtons}>
            <Pressable
              onPress={saveAvailability}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
            <Pressable
              onPress={() => setIsEditingAvailability(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Pending Applications
      </Text>

      {pendingJobs.length === 0 && (
        <Text style={styles.emptyText}>No pending applications</Text>
      )}

      {pendingJobs.map((job) => {
        const hasApprovedWorker = job.applications?.some(
          (a: any) => a.status === 'approved'
        );

        return (
          <View
            key={job.id}
            style={[
              styles.jobCard,
              hasApprovedWorker ? styles.jobCardFilled : styles.jobCardPending
            ]}
          >
            <Text style={hasApprovedWorker ? styles.jobStatusRed : styles.jobStatusYellow}>
              {hasApprovedWorker ? 'Position Filled' : 'Pending'}
            </Text>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobDetail}>{job.location}</Text>
            <Text style={styles.jobDetail}>{job.date} • {job.startTime} - {job.endTime}</Text>
            {hasApprovedWorker && (
              <Text style={styles.filledMessage}>
                This position was filled. Your application was not selected.
              </Text>
            )}
          </View>
        );
      })}

      <Text style={styles.sectionTitle}>
        My Approved Jobs
      </Text>

      {approvedJobs.length === 0 && (
        <Text style={styles.emptyText}>No approved jobs yet</Text>
      )}

      {approvedJobs.map((job) => (
        <View key={job.id} style={styles.jobCardApproved}>
          <Text style={styles.jobStatusGreen}>Approved</Text>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobDetail}>{job.location}</Text>
          <Text style={styles.jobDetail}>{job.date} • {job.startTime} - {job.endTime}</Text>
        </View>
      ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 32,
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
  emptyText: {
    color: '#6b7280',
    marginBottom: 12,
  },
  availabilityBlock: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  availabilityText: {
    fontSize: 15,
    color: '#374151',
  },
  editButton: {
    padding: 12,
    backgroundColor: '#14b8a6',
    borderRadius: 8,
    marginTop: 8,
  },
  editButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  editBlock: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  blockTitle: {
    fontWeight: '600',
    marginBottom: 12,
    fontSize: 16,
    color: '#111827',
  },
  label: {
    marginBottom: 8,
    marginTop: 8,
    fontWeight: '500',
    color: '#374151',
  },
  dayButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  dayButton: {
    padding: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    minWidth: 45,
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#14b8a6',
  },
  dayButtonText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '500',
  },
  dayButtonTextActive: {
    color: 'white',
  },
  timePickerButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  timePickerText: {
    fontSize: 16,
    color: '#111827',
  },
  removeButton: {
    padding: 10,
    backgroundColor: '#dc2626',
    borderRadius: 6,
    marginTop: 12,
  },
  removeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  addButton: {
    padding: 12,
    backgroundColor: '#16a34a',
    borderRadius: 8,
    marginBottom: 12,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  saveButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#14b8a6',
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#6b7280',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  jobCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  jobCardPending: {
    backgroundColor: '#fef3c7',
    borderColor: '#fbbf24',
  },
  jobCardFilled: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
  },
  jobCardApproved: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#6ee7b7',
  },
  jobStatusGreen: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
    color: '#065f46',
  },
  jobStatusYellow: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
    color: '#92400e',
  },
  jobStatusRed: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
    color: '#991b1b',
  },
  jobTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
    color: '#111827',
  },
  jobDetail: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 2,
  },
  filledMessage: {
    marginTop: 8,
    fontSize: 12,
    color: '#7f1d1d',
  },
});
