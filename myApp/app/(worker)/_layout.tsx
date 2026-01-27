import { Tabs, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function WorkerLayout() {
  const router = useRouter();

  const headerLeft = () => (
    <Pressable
      onPress={() => router.replace('/')}
      style={{ marginLeft: 12 }}
    >
      <Text style={{ color: '#2563eb', fontSize: 16 }}>
        Home
      </Text>
    </Pressable>
  );

  return (
    <Tabs>
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          headerShown: true,
          headerLeft,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: true,
          headerLeft,
        }}
      />
    </Tabs>
  );
}