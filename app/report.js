import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useLocalSearchParams } from 'expo-router';

export default function ReportScreen() {
  const params = useLocalSearchParams();
  const [severity, setSeverity] = useState('Critical');
  const [casualties, setCasualties] = useState('1');
  const [accidentType, setAccidentType] = useState('Bus');
  const [vehiclesInvolved, setVehiclesInvolved] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState({
    lat: parseFloat(params.lat) || null,
    lng: parseFloat(params.lng) || null
  });

  const handleSubmit = async () => {
    if (!location.lat || !location.lng) {
      Alert.alert('Error', 'Location data is missing');
      return;
    }
    setIsSubmitting(true);
    const reportData = {
      severity,
      casualties,
      accidentType,
      vehiclesInvolved,
      timestamp: new Date().toISOString(),
      // Add location data
      location: {
        latitude: location.lat,
        longitude: location.lng
      },
      status: 'Unattended'
    };

  //   // Simulate API call
  //   setTimeout(() => {
  //     console.log('Submitted:', reportData);
  //     setIsSubmitting(false);
  //     Alert.alert('Success', 'Accident report submitted successfully');
  //     router.back();
  //   }, 1500);
  // };
  try {
    // Store the report data in a Firestore collection called 'accidentReports'
    const docRef = await addDoc(collection(db, "accidentReports"), reportData);
    console.log("Document written with ID:", docRef.id);
    Alert.alert('Success', 'Accident report submitted successfully');
    router.back();
  } catch (error) {
    console.error("Error adding document:", error);
    Alert.alert('Error', 'There was an error submitting your report');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <MaterialIcons name="report-problem" size={28} color="#e53935" />
        <Text style={styles.header}>Report Accident</Text>
      </View>

      <View style={styles.formCard}>
        {/* Severity Dropdown */}
        <View style={styles.field}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="warning" size={18} color="#666" />
            <Text style={styles.label}>Severity Level</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={severity}
              onValueChange={setSeverity}
              style={styles.picker}
              dropdownIconColor="#e53935"
            >
              <Picker.Item label="Critical Situation" value="Critical" />
              <Picker.Item label="Moderate Incident" value="Moderate" />
              <Picker.Item label="Minor Collision" value="Minor" />
            </Picker>
          </View>
        </View>

        {/* Casualties Dropdown */}
        <View style={styles.field}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="personal-injury" size={18} color="#666" />
            <Text style={styles.label}>Casualties Involved</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={casualties}
              onValueChange={setCasualties}
              style={styles.picker}
              dropdownIconColor="#e53935"
            >
              <Picker.Item label="1 Person" value="1" />
              <Picker.Item label="2 People" value="2" />
              <Picker.Item label="Multiple (2+)" value="More than 2" />
              <Picker.Item label="Several (5+)" value="More than 5" />
              <Picker.Item label="Many (10+)" value="More than 10" />
              <Picker.Item label="Large Scale (20+)" value="More than 20" />
            </Picker>
          </View>
        </View>

        {/* Type of Accident Dropdown */}
        <View style={styles.field}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="car-crash" size={18} color="#666" />
            <Text style={styles.label}>Accident Type</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={accidentType}
              onValueChange={setAccidentType}
              style={styles.picker}
              dropdownIconColor="#e53935"
            >
              <Picker.Item label="Bus Accident" value="Bus" />
              <Picker.Item label="Plane Accident" value="Plane" />
              <Picker.Item label="Car Collision" value="Car" />
              <Picker.Item label="Motorcycle Crash" value="Bike" />
              <Picker.Item label="Heavy Vehicle Incident" value="Transport Heavy Vehicle" />
            </Picker>
          </View>
        </View>

        {/* Vehicles Involved Dropdown */}
        <View style={styles.field}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="directions-car" size={18} color="#666" />
            <Text style={styles.label}>Vehicles Involved</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={vehiclesInvolved}
              onValueChange={setVehiclesInvolved}
              style={styles.picker}
              dropdownIconColor="#e53935"
            >
              <Picker.Item label="Single Vehicle" value="1" />
              <Picker.Item label="2 Vehicles" value="2" />
              <Picker.Item label="3 Vehicles" value="3" />
              <Picker.Item label="4 Vehicles" value="4" />
              <Picker.Item label="Multi-Vehicle (4+)" value="More than 4" />
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity 
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="send" size={20} color="#fff" />
              <Text style={styles.buttonText}>Submit Report</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}
          disabled={isSubmitting}
        >
          <MaterialIcons name="cancel" size={20} color="#666" />
          <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginLeft: 10,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  field: {
    marginBottom: 25,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#34495e',
    marginLeft: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ecf0f1',
    borderRadius: 8,
    backgroundColor: '#fdfdfd',
  },
  picker: {
    color: '#2c3e50',
  },
  buttonGroup: {
    marginTop: 25,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  submitButton: {
    backgroundColor: '#e53935',
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#666',
  },
});