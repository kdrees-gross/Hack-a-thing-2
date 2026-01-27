import { Text, TextInput, Pressable, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

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

      alert('✅ Job posted successfully');

      // reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setPay('');
      setDate(new Date());
      setStartTime(new Date());
      setEndTime(new Date());
    } catch (err) {
      alert('❌ Error posting job');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 24 }}>
        Post a Job
      </Text>

      <TextInput
        placeholder="Job title"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 12,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 12,
          marginBottom: 12,
          minHeight: 80,
        }}
      />

      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 12,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Pay (e.g. $50)"
        value={pay}
        onChangeText={setPay}
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 12,
          marginBottom: 12,
        }}
      />

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
        Date
      </Text>
      <Pressable
        onPress={() => setShowDatePicker(true)}
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 12,
          marginBottom: 12,
          backgroundColor: '#f9fafb',
        }}
      >
        <Text>{formatDate(date)}</Text>
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

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
        Start Time
      </Text>
      <Pressable
        onPress={() => setShowStartTimePicker(true)}
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 12,
          marginBottom: 12,
          backgroundColor: '#f9fafb',
        }}
      >
        <Text>{formatTime(startTime)}</Text>
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

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
        End Time
      </Text>
      <Pressable
        onPress={() => setShowEndTimePicker(true)}
        style={{
          borderWidth: 1,
          borderRadius: 6,
          padding: 12,
          marginBottom: 24,
          backgroundColor: '#f9fafb',
        }}
      >
        <Text>{formatTime(endTime)}</Text>
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
        style={{
          padding: 16,
          backgroundColor: submitting ? '#9ca3af' : '#2563eb',
          borderRadius: 8,
          marginBottom: 32,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
          {submitting ? 'Posting…' : 'Post Job'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
