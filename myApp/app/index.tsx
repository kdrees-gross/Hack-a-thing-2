// Developed with the assistance of Dartmouth ChatGPT
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>
          Taskly
        </Text>

        <Pressable
          style={styles.loginButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>
            Log In
          </Text>
        </Pressable>

        <Pressable
          style={styles.signupButton}
          onPress={() => router.push('/signup')}
        >
          <Text style={styles.buttonText}>
            Sign Up
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    letterSpacing: 3,
    marginBottom: 40,
  },
  loginButton: {
    padding: 16,
    backgroundColor: '#14b8a6',
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  signupButton: {
    padding: 16,
    backgroundColor: '#0d9488',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});