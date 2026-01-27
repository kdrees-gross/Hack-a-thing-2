import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      const user = await login(username, password);
      // Small delay to ensure state propagates before navigation
      setTimeout(() => {
        router.replace(user.role === 'worker' ? '/(worker)/jobs' : '/(poster)/my-jobs');
      }, 100);
    } catch {
      alert('Login failed');
    }
  }

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Log In</Text>

      <TextInput placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <Pressable onPress={handleLogin}>
        <Text>Log In</Text>
      </Pressable>
    </View>
  );
}