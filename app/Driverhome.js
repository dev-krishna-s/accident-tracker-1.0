// app/driverHome.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { router } from 'expo-router';

const DriverHome = () => {
  // States
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [accidentReports, setAccidentReports] = useState([]);
  const [cachedLoc, setCachedLoc] = useState(null);
  const progress = useState(new Animated.Value(0))[0];

  // Region handling
  const initialRegion = {
    latitude: 8.8805,
    longitude: 76.5917,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const [region, setRegion] = useState(initialRegion);

  // Location logic
  useEffect(() => {
    let isMounted = true;
    const progressAnim = Animated.timing(progress, { 
      toValue: 1, duration: 2500, useNativeDriver: false 
    });
    
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return setErrorMsg('Location permission required');

        const lastKnown = await Location.getLastKnownPositionAsync();
        if (lastKnown?.coords) {
          setCachedLoc(lastKnown.coords);
          setRegion({ ...lastKnown.coords, ...initialRegion });
        }

        progressAnim.start();
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Lowest,
          timeInterval: 5000
        });
        
        if (isMounted) {
          setLocation(location.coords);
          setRegion({ ...location.coords, ...initialRegion });
        }
      } catch (error) {
        setErrorMsg(error.message);
        if (cachedLoc) setRegion({ ...cachedLoc, ...initialRegion });
      }
    };

    fetchLocation();
    return () => {
      isMounted = false;
      progressAnim.stop();
    };
  }, []);

  // Accident reports
  useEffect(() => 
    onSnapshot(collection(db, 'accidentReports'), snapshot => {
      const reports = snapshot.docs.map(doc => {
        const data = doc.data();
        return data.location?.latitude ? {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() || new Date()
        } : null;
      }).filter(Boolean);
      
      setAccidentReports(reports);
    }
  ), []);

  // Handlers
  const toggleOnline = () => {
    if (!location && !isOnline) {
      Alert.alert('Location Required', 'Enable location to go online');
    } else {
      setIsOnline(!isOnline);
    }
  };

  const displayLoc = location || cachedLoc;

  return (
    <View style={styles.container}>
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Status: <Text style={isOnline ? styles.online : styles.offline}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </Text>
      </View>

      {errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => setErrorMsg(null)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <MapView style={styles.map} provider={PROVIDER_GOOGLE} region={region}>
          {displayLoc && (
            <Marker coordinate={displayLoc}>
              <MaterialIcons 
                name={location ? "my-location" : "location-disabled"} 
                size={28} 
                color={location ? "#34A853" : "#EA4335"} 
              />
            </Marker>
          )}

          {accidentReports.map(report => (
            <Marker key={report.id} coordinate={report.location} pinColor="#FF0000">
              <Callout tooltip>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>Accident Report</Text>
                  <Text>Type: {report.accidentType || 'N/A'}</Text>
                  <Text>Severity: {report.severity || 'N/A'}</Text>
                  <Text>Time: {report.timestamp.toLocaleString()}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.btn, isOnline ? styles.onlineBtn : styles.offlineBtn]}
          onPress={toggleOnline}
        >
          <MaterialIcons name={isOnline ? 'wifi-off' : 'wifi'} size={24} color="white" />
          <Text style={styles.btnText}>{isOnline ? 'Offline' : 'Online'}</Text>
        </TouchableOpacity>

        {isOnline && (
          <TouchableOpacity style={[styles.btn, styles.recordsBtn]} onPress={() => router.push('/accidentRecords')}>
            <MaterialIcons name="history" size={24} color="white" />
            <Text style={styles.btnText}>Records</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  statusBar: { 
    padding: 16, 
    backgroundColor: '#fff', 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 2 
  },
  statusText: { 
    fontSize: 18, 
    fontWeight: '600', 
    textAlign: 'center' 
  },
  online: { color: '#34A853' },
  offline: { color: '#EA4335' },
  map: { flex: 1 },
  errorContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  errorText: { 
    color: '#EA4335', 
    fontSize: 16, 
    marginBottom: 16 
  },
  retryBtn: { 
    padding: 12, 
    backgroundColor: '#E8F0FE', 
    borderRadius: 8 
  },
  retryText: { 
    color: '#1967D2', 
    fontWeight: '600' 
  },
  controls: { 
    position: 'absolute', 
    bottom: 24, 
    left: 16, 
    right: 16, 
    flexDirection: 'row', 
    gap: 12 
  },
  btn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 14, 
    borderRadius: 8, 
    minWidth: 120 
  },
  onlineBtn: { backgroundColor: '#34A853' },
  offlineBtn: { backgroundColor: '#EA4335' },
  recordsBtn: { backgroundColor: '#FBBC05', flex: 0.5 },
  btnText: { 
    color: 'white', 
    marginLeft: 8, 
    fontWeight: '600' 
  },
  callout: { 
    width: 200, 
    padding: 12, 
    borderRadius: 8 
  },
  calloutTitle: { 
    fontWeight: '700', 
    color: '#4285F4', 
    marginBottom: 6 
  }
});

export default DriverHome;