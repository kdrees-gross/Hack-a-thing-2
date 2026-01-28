import { Text, TextInput, Pressable, ScrollView, Platform, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

export default function PostJob() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pay, setPay] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  async function handlePost() {
    if (!title || !description || !location || !pay) {
      alert('Please fill out all fields');
      return;
    }

    if (!user?.id) {
      alert('You must be logged in to post a job');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('http://127.0.0.1:4000/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          location,
          pay,
          date: formatDate(date),
          startTime: formatTime(startTime),
          endTime: formatTime(endTime),
          postedBy: user.id,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to post job');
      }

      alert('Job posted successfully');

      // reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setPay('');
      setDate(new Date());
      setStartTime(new Date());
      setEndTime(new Date());
    } catch (err) {
      alert('Error posting job');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <LinearGradient
      colors={['#99f6e4', '#5eead4', '#2dd4bf']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView style={styles.content}>
      <Text style={styles.title}>
        Post a Job
      </Text>
      <Text style={styles.instructions}>
        Fill out the details below to post a job. Workers will be able to apply based on their availability.
      </Text>

      <TextInput
        placeholder="Job title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, styles.inputMultiline]}
      />

      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <TextInput
        placeholder="Pay (e.g. $50)"
        value={pay}
        onChangeText={setPay}
        style={styles.input}
      />

      <Text style={styles.label}>
        Date
      </Text>
      <Pressable
        onPress={() => setShowDatePicker(true)}
        style={styles.pickerButton}
      >
        <Text style={styles.pickerText}>{formatDate(date)}</Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_event: DateTimePickerEvent, selectedDate?: Date) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}

      <Text style={styles.label}>
        Start Time
      </Text>
      <Pressable
        onPress={() => setShowStartTimePicker(true)}
        style={styles.pickerButton}
      >
        <Text style={styles.pickerText}>{formatTime(startTime)}</Text>
      </Pressable>
      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minuteInterval={15}
          onChange={(_event: DateTimePickerEvent, selectedTime?: Date) => {
            setShowStartTimePicker(Platform.OS === 'ios');
            if (selectedTime) {
              setStartTime(selectedTime);
            }
          }}
        />
      )}

      <Text style={styles.label}>
        End Time
      </Text>
      <Pressable
        onPress={() => setShowEndTimePicker(true)}
        style={[styles.pickerButton, styles.lastPicker]}
      >
        <Text style={styles.pickerText}>{formatTime(endTime)}</Text>
      </Pressable>
      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minuteInterval={15}
          onChange={(_event: DateTimePickerEvent, selectedTime?: Date) => {
            setShowEndTimePicker(Platform.OS === 'ios');
            if (selectedTime) {
              setEndTime(selectedTime);
            }
          }}
        />
      )}

      <Pressable
        onPress={handlePost}
        disabled={submitting}
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
      >
        <Text style={styles.submitButtonText}>
          {submitting ? 'Posting…' : 'Post Job'}
        </Text>
      </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
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
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'white',
    fontSize: 16,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
    color: '#374151',
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  lastPicker: {
    marginBottom: 24,
  },
  pickerText: {
    fontSize: 16,
    color: '#111827',
  },
  submitButton: {
    padding: 16,
    backgroundColor: '#14b8a6',
    borderRadius: 8,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
