import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'worker' | 'poster'>('worker');

  async function handleSignup() {
    try {
      await signup(username, password, role);
      router.replace(role === 'worker' ? '/(worker)/jobs' : '/(poster)/my-jobs');
    } catch {
      alert('Signup failed');
    }
  }

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Sign Up</Text>

      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <Pressable onPress={() => setRole('worker')}>
        <Text>{role === 'worker' ? '✅ Worker' : 'Worker'}</Text>
      </Pressable>

      <Pressable onPress={() => setRole('poster')}>
        <Text>{role === 'poster' ? '✅ Poster' : 'Poster'}</Text>
      </Pressable>

      <Pressable onPress={handleSignup}>
        <Text>Sign Up</Text>
      </Pressable>
    </View>
  );
}