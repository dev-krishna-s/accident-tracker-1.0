import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AccidentRecords = () => {
  const [accidentReports, setAccidentReports] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const q = query(collection(db, 'accidentReports'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reports = [];
      querySnapshot.forEach((doc) => {
        reports.push({ id: doc.id, ...doc.data() });
      });
      setAccidentReports(reports);
    });
    return () => unsubscribe();
  }, []);

  const handleRespond = async (item) => {
    // Handle location
    if (item.location && typeof item.location.latitude === 'number' && typeof item.location.longitude === 'number') {
      const url = `https://www.google.com/maps/search/?api=1&query=${item.location.latitude},${item.location.longitude}`;
      Linking.openURL(url).catch((err) =>
        Alert.alert('Error', 'Failed to open Google Maps: ' + err.message)
      );
    } else {
      Alert.alert('Location Error', 'Invalid location data for this accident.');
    }

    // Update status in Firestore
    try {
      const reportRef = doc(db, 'accidentReports', item.id);
      await updateDoc(reportRef, {
        status: 'Help on way'
      });
    } catch (error) {
      Alert.alert('Update Error', 'Could not update status: ' + error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.recordItem}>
      <View style={styles.recordHeader}>
        <View style={styles.titleAndStatus}>
          <Text style={styles.recordTitle}>Accident Record</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'Help on way' ? '#5cb85c' : '#f0ad4e' }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.responseTag} onPress={() => handleRespond(item)}>
          <Text style={styles.responseTagText}>Respond</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.recordText}>Severity: {item.severity}</Text>
      <Text style={styles.recordText}>Type: {item.accidentType}</Text>
      <Text style={styles.recordText}>Vehicles: {item.vehiclesInvolved}</Text>
      <Text style={styles.recordText}>Casualties: {item.casualties}</Text>
      <Text style={styles.recordText}>Time: {new Date(item.timestamp).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Accident Records</Text>
      </View>
      {accidentReports.length > 0 ? (
        <FlatList
          data={accidentReports}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.emptyText}>No accident records available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginLeft: 8,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 16 },
  listContent: { padding: 16 },
  recordItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleAndStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordTitle: { fontSize: 18, fontWeight: 'bold' },
  statusBadge: {
    backgroundColor: '#f0ad4e',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  responseTag: {
    backgroundColor: '#007bff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  responseTagText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  recordText: { fontSize: 16, marginBottom: 4 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16 },
});

export default AccidentRecords;
