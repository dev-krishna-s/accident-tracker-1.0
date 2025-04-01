import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function UserRegistrationScreen() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    aadhar: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!formData.aadhar.trim()) {
      newErrors.aadhar = "Aadhar number is required";
    } else if (formData.aadhar.length !== 12) {
      newErrors.aadhar = "Aadhar number must be 12 digits";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Remove confirmPassword before storing
      const { confirmPassword, ...userData } = formData;
      await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: serverTimestamp()
      });
      Alert.alert('Registration Successful', 'Please login with your credentials', [
        { text: 'OK', onPress: () => router.replace('/userLogin') }
      ]);
      // Optionally, clear the form or handle post-registration actions
      setFormData({
        name: '',
        phone: '',
        aadhar: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Registration</Text>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Full Name"
          value={formData.name}
          onChangeText={text => handleChange('name', text)}
          style={[styles.input, errors.name && styles.errorBorder]}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        <TextInput
          placeholder="Phone Number (10 digits)"
          value={formData.phone}
          onChangeText={text => handleChange('phone', text.replace(/[^0-9]/g, ''))}
          keyboardType="phone-pad"
          maxLength={10}
          style={[styles.input, errors.phone && styles.errorBorder]}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        <TextInput
          placeholder="Aadhar Number (12 digits)"
          value={formData.aadhar}
          onChangeText={text => handleChange('aadhar', text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          maxLength={12}
          style={[styles.input, errors.aadhar && styles.errorBorder]}
        />
        {errors.aadhar && <Text style={styles.errorText}>{errors.aadhar}</Text>}
        <TextInput
          placeholder="Password"
          value={formData.password}
          onChangeText={text => handleChange('password', text)}
          secureTextEntry
          style={[styles.input, errors.password && styles.errorBorder]}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        <TextInput
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={text => handleChange('confirmPassword', text)}
          secureTextEntry
          style={[styles.input, errors.confirmPassword && styles.errorBorder]}
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.disabledButton]}
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
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
  errorText: {
    color: '#e53935',
    fontSize: 14,
    marginLeft: 10,
  },
  errorBorder: {
    borderColor: '#e53935',
  },
  button: {
    backgroundColor: '#e53935',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#f58c8c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
