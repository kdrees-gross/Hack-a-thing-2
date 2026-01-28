// Developed with the assistance of Dartmouth ChatGPT
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="signup"
          options={{
            title: 'Sign Up',
            headerBackTitle: 'Back'
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: 'Log In',
            headerBackTitle: 'Back'
          }}
        />
        <Stack.Screen name="(worker)" options={{ headerShown: false }} />
        <Stack.Screen name="(poster)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}