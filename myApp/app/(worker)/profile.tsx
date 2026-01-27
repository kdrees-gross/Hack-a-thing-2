import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { AvailabilityBlock } from '@/types/user';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Profile() {
  const { user } = useAuth();
  const [approvedJobs, setApprovedJobs] = useState<any[]>([]);
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [availability, setAvailability] = useState<AvailabilityBlock[]>([]);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);

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
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
    >
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
        My Availability
      </Text>

      {!isEditingAvailability && (
        <>
          {availability.length === 0 ? (
            <Text style={{ marginBottom: 12 }}>No availability set</Text>
          ) : (
            availability.map((block, index) => (
              <Text key={index} style={{ marginBottom: 4 }}>
                {DAYS[block.dayOfWeek]}: {block.startTime} - {block.endTime}
              </Text>
            ))
          )}
          <Pressable
            onPress={() => setIsEditingAvailability(true)}
            style={{ padding: 12, backgroundColor: '#2563eb', borderRadius: 6, marginTop: 8 }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>
              {availability.length === 0 ? 'Set Availability' : 'Edit Availability'}
            </Text>
          </Pressable>
        </>
      )}

      {isEditingAvailability && (
        <View>
          {availability.map((block, index) => (
            <View key={index} style={{ borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <Text style={{ fontWeight: '600', marginBottom: 8 }}>Block {index + 1}</Text>

              <Text style={{ marginBottom: 4 }}>Day of Week:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                {DAYS.map((day, dayIndex) => (
                  <Pressable
                    key={dayIndex}
                    onPress={() => updateAvailabilityBlock(index, 'dayOfWeek', dayIndex)}
                    style={{
                      padding: 8,
                      margin: 4,
                      backgroundColor: block.dayOfWeek === dayIndex ? '#2563eb' : '#e5e7eb',
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ color: block.dayOfWeek === dayIndex ? 'white' : 'black', fontSize: 12 }}>
                      {day.slice(0, 3)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={{ marginBottom: 4 }}>Start Time (HH:MM):</Text>
              <TextInput
                value={block.startTime}
                onChangeText={(text) => updateAvailabilityBlock(index, 'startTime', text)}
                placeholder="09:00"
                style={{ borderWidth: 1, borderRadius: 6, padding: 8, marginBottom: 8 }}
              />

              <Text style={{ marginBottom: 4 }}>End Time (HH:MM):</Text>
              <TextInput
                value={block.endTime}
                onChangeText={(text) => updateAvailabilityBlock(index, 'endTime', text)}
                placeholder="17:00"
                style={{ borderWidth: 1, borderRadius: 6, padding: 8, marginBottom: 8 }}
              />

              <Pressable
                onPress={() => removeAvailabilityBlock(index)}
                style={{ padding: 8, backgroundColor: '#dc2626', borderRadius: 4 }}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Remove</Text>
              </Pressable>
            </View>
          ))}

          <Pressable
            onPress={addAvailabilityBlock}
            style={{ padding: 12, backgroundColor: '#16a34a', borderRadius: 6, marginBottom: 12 }}
          >
            <Text style={{ color: 'white', textAlign: 'center' }}>Add Time Block</Text>
          </Pressable>

          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <Pressable
              onPress={saveAvailability}
              style={{ flex: 1, padding: 12, backgroundColor: '#2563eb', borderRadius: 6 }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Save</Text>
            </Pressable>
            <Pressable
              onPress={() => setIsEditingAvailability(false)}
              style={{ flex: 1, padding: 12, backgroundColor: '#6b7280', borderRadius: 6 }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Text style={{ fontSize: 24, marginTop: 32, marginBottom: 16 }}>
        Pending Applications
      </Text>

      {pendingJobs.length === 0 && (
        <Text>No pending applications</Text>
      )}

      {pendingJobs.map((job) => {
        const hasApprovedWorker = job.applications?.some(
          (a: any) => a.status === 'approved'
        );

        return (
          <View
            key={job.id}
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: hasApprovedWorker ? '#dc2626' : '#f59e0b',
              borderRadius: 8,
              marginBottom: 8,
              backgroundColor: hasApprovedWorker ? '#fee2e2' : '#fef3c7'
            }}
          >
            <Text style={{ fontWeight: '600' }}>
              {hasApprovedWorker ? '❌ Position Filled' : '⏳ Pending'}
            </Text>
            <Text style={{ fontWeight: '600', marginTop: 4 }}>{job.title}</Text>
            <Text>{job.location}</Text>
            <Text>{job.date} • {job.startTime} - {job.endTime}</Text>
            {hasApprovedWorker && (
              <Text style={{ marginTop: 4, fontSize: 12, color: '#7f1d1d' }}>
                This position was filled. Your application was not selected.
              </Text>
            )}
          </View>
        );
      })}

      <Text style={{ fontSize: 24, marginTop: 32, marginBottom: 16 }}>
        My Approved Jobs
      </Text>

      {approvedJobs.length === 0 && (
        <Text>No approved jobs yet</Text>
      )}

      {approvedJobs.map((job) => (
        <View key={job.id} style={{ padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 8 }}>
          <Text style={{ fontWeight: '600' }}>✅ {job.title}</Text>
          <Text>{job.location}</Text>
          <Text>{job.date} • {job.startTime} - {job.endTime}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
