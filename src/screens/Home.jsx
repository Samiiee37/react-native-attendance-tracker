import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

export default function Home({ navigation }) {
  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState('');
  const [percentages, setPercentages] = useState({}); // { subject: 85 }

  useFocusEffect(
    React.useCallback(() => {
      loadSubjects();
    }, []),
  );

  const loadSubjects = async () => {
    const data = await AsyncStorage.getItem('subjects');
    if (data) {
      const loadedSubjects = JSON.parse(data);
      setSubjects(loadedSubjects);
      loadAttendancePercentages(loadedSubjects);
    }
  };

  const loadAttendancePercentages = async subjects => {
    const percentageMap = {};

    for (const subject of subjects) {
      const data = await AsyncStorage.getItem(`attendance_${subject}`);
      if (data) {
        const parsed = JSON.parse(data);
        const total = Object.values(parsed).reduce(
          (acc, d) => acc + (d.total || 0),
          0,
        );
        const attended = Object.values(parsed).reduce(
          (acc, d) => acc + (d.attended || 0),
          0,
        );
        const percent = total === 0 ? 0 : Math.round((attended / total) * 100);
        percentageMap[subject] = percent;
      } else {
        percentageMap[subject] = 0;
      }
    }

    setPercentages(percentageMap);
  };

  const saveSubjects = async newSubjects => {
    await AsyncStorage.setItem('subjects', JSON.stringify(newSubjects));
    loadAttendancePercentages(newSubjects);
  };

  const addSubject = () => {
    if (!subjectInput.trim()) {
      Alert.alert('Empty Field', 'Please enter a subject name.');
      return;
    }
    const newSubjects = [...subjects, subjectInput.trim()];
    setSubjects(newSubjects);
    saveSubjects(newSubjects);
    setSubjectInput('');
  };

  const handleDeleteSubject = subjectToDelete => {
    Alert.alert(
      'Delete Subject',
      `Are you sure you want to delete "${subjectToDelete}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedSubjects = subjects.filter(s => s !== subjectToDelete);
            setSubjects(updatedSubjects);
            saveSubjects(updatedSubjects);
            await AsyncStorage.removeItem(`attendance_${subjectToDelete}`);
          },
        },
      ],
    );
  };

  const renderSubject = ({ item }) => (
    <View style={styles.subjectCard}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => navigation.navigate('Subject', { subject: item })}
      >
        <Text style={styles.subjectText}>
          {item}{' '}
          <Text style={styles.percentText}>({percentages[item] ?? 0}%)</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleDeleteSubject(item)}>
        <Ionicons name="trash" size={20} color="#f87171" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>My Subjects</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Add new subject"
          value={subjectInput}
          onChangeText={setSubjectInput}
          style={styles.input}
          placeholderTextColor="#94a3b8"
        />
        <TouchableOpacity style={styles.addButton} onPress={addSubject}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={subjects}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderSubject}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
    color: '#f1f5f9',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#f1f5f9',
  },
  addButton: {
    backgroundColor: '#6366f1',
    padding: 5,
    borderRadius: 50,
  },
  subjectCard: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 15,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  subjectText: {
    fontSize: 16,
    color: '#f8fafc',
  },
  percentText: {
    fontSize: 15,
    color: '#94a3b8',
  },
});
