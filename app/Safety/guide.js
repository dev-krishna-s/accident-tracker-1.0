// app/guide.js
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const faqData = [
  {
    question: 'What to do in case of bleeding?',
    answer: '1. Apply direct pressure with a clean cloth\n2. Elevate the injured area\n3. Seek medical help if bleeding persists'
  },
  {
    question: 'How to treat burns?',
    answer: '1. Cool the burn under running water for 10-15 mins\n2. Cover with sterile dressing\n3. Avoid bursting blisters'
  },
  {
    question: 'What to do for broken bones?',
    answer: '1. Immobilize the injured area\n2. Apply ice to reduce swelling\n3. Seek immediate medical attention'
  },
  {
    question: 'How to perform CPR?',
    answer: '1. Check responsiveness\n2. Call emergency services\n3. Push hard and fast in center of chest (100-120/min)'
  }
];

const SafetyGuide = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleItem = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>First Aid Safety Guide</Text>
      <ScrollView>
        {faqData.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <TouchableOpacity 
              style={styles.questionContainer}
              onPress={() => toggleItem(index)}
            >
              <Text style={styles.questionText}>{item.question}</Text>
              <MaterialIcons
                name={expandedIndex === index ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
            
            {expandedIndex === index && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerText}>{item.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e53935',
    marginBottom: 20,
    textAlign: 'center'
  },
  itemContainer: {
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden'
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginRight: 10
  },
  answerContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa'
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22
  }
});

export default SafetyGuide;