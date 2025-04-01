import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const SelectionScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.subtitle}>Choose how you'll use the app</Text>
                
                <View style={styles.optionsContainer}>
                    <TouchableOpacity 
                        style={styles.option} 
                        onPress={() => navigation.navigate('Driverlogin')}
                    >
                        <View style={[styles.iconCircle, styles.driverCircle]}>
                            <MaterialIcons name="drive-eta" size={28} color="#fff" />
                        </View>
                        <Text style={styles.optionTitle}>Driver</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.divider} />
                    
                    <TouchableOpacity 
                        style={styles.option} 
                        onPress={() => navigation.navigate('userLogin')}
                    >
                        <View style={[styles.iconCircle, styles.userCircle]}>
                            <MaterialIcons name="person" size={28} color="#fff" />
                        </View>
                        <Text style={styles.optionTitle}>User</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 50,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    option: {
        flex: 1,
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: '80%',
        backgroundColor: '#e0e0e0',
        marginHorizontal: 10,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    driverCircle: {
        backgroundColor: '#4285F4',
    },
    userCircle: {
        backgroundColor: '#34A853',
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    }
});

export default SelectionScreen;