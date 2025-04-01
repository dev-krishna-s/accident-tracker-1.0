import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';

export default function AuthScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);

  const validatePhone = () => {
    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    return cleanedPhone.length >= 10;
  };

  const handleSendOTP = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
    
    if (!validatePhone()) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }
    
    setShowOtpField(true);
  };

  const handleVerify = () => {
    if (otp === '123456') {
      router.push({
        pathname: '/main',
        params: { userName: name.trim() }
      });
    } else {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      {!showOtpField ? (
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            autoCapitalize="words"
          />
          <TextInput
            placeholder="Phone Number"
            value={phone}
            onChangeText={text => setPhone(text.replace(/[^0-9]/g, ''))}
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={10}
          />
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSendOTP}
          >
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Enter OTP (123456)"
            value={otp}
            onChangeText={text => setOtp(text.replace(/[^0-9]/g, ''))}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={6}
          />
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleVerify}
          >
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </View>
      )}
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
});