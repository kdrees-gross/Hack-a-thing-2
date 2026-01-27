import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';

export default function PostJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pay, setPay] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handlePost() {
    if (!title || !description || !location || !pay) {
      alert('Please fill out all fields');
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
    } catch (err) {
      alert('❌ Error posting job');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
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
          marginBottom: 24,
        }}
      />

      <Pressable
        onPress={handlePost}
        disabled={submitting}
        style={{
          padding: 16,
          backgroundColor: submitting ? '#9ca3af' : '#2563eb',
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
          {submitting ? 'Posting…' : 'Post Job'}
        </Text>
      </Pressable>
    </View>
  );
}