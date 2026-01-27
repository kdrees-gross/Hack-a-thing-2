import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 28, marginBottom: 32 }}>
        Marketplace
      </Text>

      <Pressable
        style={{ padding: 16, backgroundColor: '#2563eb', marginBottom: 12 }}
        onPress={() => router.push('/login')}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Log In
        </Text>
      </Pressable>

      <Pressable
        style={{ padding: 16, backgroundColor: '#16a34a' }}
        onPress={() => router.push('/signup')}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Sign Up
        </Text>
      </Pressable>
    </View>
  );
}