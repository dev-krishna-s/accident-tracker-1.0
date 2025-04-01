import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function UserLoginScreen() {
  const [aadhar, setAadhar] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!aadhar.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both Aadhar number and password');
      return;
    }
    setIsLoading(true);
    try {
      const userQuery = query(
        collection(db, 'users'),
        where('aadhar', '==', aadhar),
        where('password', '==', password)
      );
      const querySnapshot = await getDocs(userQuery);
      if (querySnapshot.empty) {
        Alert.alert('Login Failed', 'Invalid Aadhar number or password');
      } else {
        // Successful login: navigate to main page
        router.push({
          pathname: '/main',
          params: { aadhar }
        });
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    router.push('/userRegistration'); // Navigate to registration screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Login</Text>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Aadhar Number (12 digits)"
          value={aadhar}
          onChangeText={text => setAadhar(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          maxLength={12}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.registerLink} onPress={handleGoToRegister}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e53935',
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
    gap: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e53935',
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#e53935',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#e53935',
    fontSize: 16,
    fontWeight: '600',
  },
});
