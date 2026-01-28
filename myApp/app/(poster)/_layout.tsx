import { Tabs, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function PosterLayout() {
  const router = useRouter();

  const headerLeft = () => (
    <Pressable
      onPress={() => router.replace('/')}
      style={{ marginLeft: 12 }}
    >
      <Text style={{ color: '#14b8a6', fontSize: 16, fontWeight: '600' }}>
        ← Back
      </Text>
    </Pressable>
  );

  return (
    <Tabs>
      <Tabs.Screen
        name="my-jobs"
        options={{
          title: 'My Jobs',
          headerShown: true,
          headerLeft,
        }}
      />
      <Tabs.Screen
        name="post-job"
        options={{
          title: 'Post Job',
          headerShown: true,
          headerLeft,
        }}
      />
    </Tabs>
  );
}