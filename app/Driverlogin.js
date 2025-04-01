import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function AuthScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in both phone number and password');
      return;
    }
    
    setIsLoading(true);
    try {
      // Query Firestore for a driver matching the phone number and password
      const driverQuery = query(
        collection(db, 'drivers'),
        where('phone', '==', phone),
        where('password', '==', password)
      );
      const querySnapshot = await getDocs(driverQuery);
      
      if (querySnapshot.empty) {
        Alert.alert('Login Failed', 'Invalid phone number or password');
      } else {
        // Navigate to the home screen (you can pass additional parameters if needed)
        router.push({
          pathname: '/Driverhome',
          params: { phone }
        });
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/Driverregister');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Login</Text>
      <View style={styles.formContainer}>
        <TextInput 
          placeholder="Phone Number" 
          value={phone} 
          onChangeText={text => setPhone(text.replace(/[^0-9]/g, ''))} 
          style={styles.input} 
          keyboardType="phone-pad" 
          maxLength={10} 
        />
        <TextInput 
          placeholder="Password" 
          value={password} 
          onChangeText={setPassword} 
          style={styles.input} 
          secureTextEntry 
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Don't have an account? Register</Text>
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
    marginBottom: 40,
  },
  formContainer: {
    gap: 20,
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
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#e53935',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
