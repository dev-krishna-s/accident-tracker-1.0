import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Animated
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Function to register for push notifications and get the Expo push token.
async function registerForPushNotificationsAsync() {
  let token = null;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Permission required', 'Failed to get push token for push notifications!');
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo push token:', token);
  } else {
    Alert.alert('Device required', 'Push notifications only work on physical devices');
  }
  return token;
}

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    aadhaar: '',
    license: '',
    vehicle: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));

  const validationPatterns = {
    phone: /^[6-9]\d{9}$/,
    aadhaar: /^[2-9]\d{11}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!validationPatterns.phone.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (!formData.aadhaar) {
      newErrors.aadhaar = "Aadhaar number is required";
    } else if (!validationPatterns.aadhaar.test(formData.aadhaar)) {
      newErrors.aadhaar = "Invalid Aadhaar number";
    }
    if (!formData.license.trim()) newErrors.license = "License details are required";
    if (!formData.vehicle.trim()) newErrors.vehicle = "Vehicle details are required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validationPatterns.password.test(formData.password)) {
      newErrors.password = "Minimum 6 chars with at least 1 letter and number";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Register for push notifications and retrieve the token.
      const pushToken = await registerForPushNotificationsAsync();

      // Remove confirmPassword before saving and include pushToken.
      const { confirmPassword, ...driverData } = formData;
      await addDoc(collection(db, 'drivers'), {
        ...driverData,
        pushToken, // Store the push notification token.
        createdAt: serverTimestamp(),
        status: 'pending',
        vehicles: formData.vehicle.split(',').map(v => v.trim())
      });

      Alert.alert(
        'Registration Successful',
        'Your account has been created',
        [{ text: 'OK', onPress: () => router.push('/Driverlogin') }]
      );
      setFormData({
        name: '',
        address: '',
        phone: '',
        aadhaar: '',
        license: '',
        vehicle: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error.message || 'Failed to create account. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleButtonPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <FontAwesome5 name="user-plus" size={32} color="#fff" />
              <Text style={styles.title}>Driver Registration</Text>
            </View>
            <Text style={styles.subtitle}>Create your account to get started</Text>
          </View>

          {Object.entries(formData).map(([field, value]) => (
            <View key={field} style={styles.inputGroup}>
              <MaterialIcons
                name={getIconName(field)}
                size={22}
                color="#666"
                style={styles.icon}
              />
              {field.includes('password') ? (
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, errors[field] && styles.errorBorder]}
                    placeholder={getPlaceholder(field)}
                    value={value}
                    onChangeText={(text) => handleChange(field, text)}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TextInput
                  style={[styles.input, errors[field] && styles.errorBorder]}
                  placeholder={getPlaceholder(field)}
                  value={value}
                  onChangeText={(text) => handleChange(field, text)}
                  keyboardType={['phone', 'aadhaar'].includes(field) ? 'numeric' : 'default'}
                  placeholderTextColor="#999"
                />
              )}
              {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
            </View>
          ))}

          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <TouchableOpacity 
              style={[styles.button, isSubmitting && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity 
            onPress={() => router.push('/Driverlogin')}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLinkText}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getIconName = (field) => ({
  name: 'person',
  address: 'home',
  phone: 'phone',
  aadhaar: 'credit-card',
  license: 'card-membership',
  vehicle: 'directions-car',
  password: 'lock',
  confirmPassword: 'lock-outline'
}[field]);

const getPlaceholder = (field) => ({
  name: 'Full Name',
  address: 'Complete Address',
  phone: 'Phone Number (10 digits)',
  aadhaar: 'Aadhaar Number (12 digits)',
  license: 'Driving License Number',
  vehicle: 'Vehicle Details (Model, Year, Color)',
  password: 'Create Password (min 6 chars)',
  confirmPassword: 'Confirm Password'
}[field]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    backgroundColor: '#e53935',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginLeft: 10,
    fontWeight: '600',
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 18,
  },
  icon: {
    position: 'absolute',
    top: 14,
    left: 12,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingLeft: 44,
    paddingRight: 44,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  inputWrapper: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  errorText: {
    color: '#e53935',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
  errorBorder: {
    borderColor: '#e53935',
  },
  button: {
    backgroundColor: '#e53935',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#f58c8c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#333',
  },
  loginLinkText: {
    color: '#e53935',
    fontWeight: '600',
  },
});

export default RegisterScreen;
