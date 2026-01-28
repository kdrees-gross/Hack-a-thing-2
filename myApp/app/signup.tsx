// Developed with the assistance of Claude
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function Signup() {
  const { signup } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'worker' | 'poster'>('worker');
  const [error, setError] = useState('');

  function validatePassword(password: string): string | null {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLetter || !hasNumber) {
      return 'Password must contain both letters and numbers';
    }

    return null;
  }

  async function handleSignup() {
    setError('');

    // Validate inputs
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const user = await signup(username, password, role);
      setTimeout(() => {
        router.replace(user.role === 'worker' ? '/(worker)/jobs' : '/(poster)/my-jobs');
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  }

  return (
    <LinearGradient
      colors={['#0d9488', '#14b8a6', '#2dd4bf']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our community today</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              placeholder="Enter your username"
              placeholderTextColor="#94a3b8"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Create a password"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>I want to...</Text>
            <View style={styles.roleButtons}>
              <Pressable
                onPress={() => setRole('worker')}
                style={[styles.roleButton, role === 'worker' && styles.roleButtonActive]}
              >
                <Text style={[styles.roleButtonText, role === 'worker' && styles.roleButtonTextActive]}>
                  Find Jobs
                </Text>
                <Text style={styles.roleDescription}>Apply to available jobs</Text>
              </Pressable>

              <Pressable
                onPress={() => setRole('poster')}
                style={[styles.roleButton, role === 'poster' && styles.roleButtonActive]}
              >
                <Text style={[styles.roleButtonText, role === 'poster' && styles.roleButtonTextActive]}>
                  Post Jobs
                </Text>
                <Text style={styles.roleDescription}>Hire workers for tasks</Text>
              </Pressable>
            </View>
          </View>

          <Pressable onPress={handleSignup}>
            <LinearGradient
              colors={['#0d9488', '#14b8a6']}
              style={styles.signupButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.signupButtonText}>Create Account</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0f172a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#0f172a',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    backgroundColor: 'white',
    alignItems: 'center',
    position: 'relative',
  },
  roleButtonActive: {
    borderColor: '#14b8a6',
    backgroundColor: '#f0fdfa',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  roleButtonTextActive: {
    color: '#0d9488',
  },
  roleDescription: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  signupButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0d9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});