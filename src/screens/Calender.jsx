import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Alert } from 'react-native';


export default function SubjectScreen({ route, navigation }) {
  const { subject } = route.params;
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [totalClasses, setTotalClasses] = useState(0);
  const [attendedClasses, setAttendedClasses] = useState(0);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    const data = await AsyncStorage.getItem(`attendance_${subject}`);
    if (data) setMarkedDates(JSON.parse(data));
  };

  const saveAttendance = async data => {
    await AsyncStorage.setItem(`attendance_${subject}`, JSON.stringify(data));
  };

  const onDayPress = day => {
    const date = day.dateString;
    setSelectedDate(date);
    const existing = markedDates[date] || { total: 0, attended: 0 };
    setTotalClasses(existing.total);
    setAttendedClasses(existing.attended);
    setModalVisible(true);
  };

  const getColor = (attended, total) => {
    if (attended === total && total > 0) return '#10b981'; // green
    if (attended === 0 && total > 0) return '#ef4444'; // red
    if (attended < total) return '#f59e0b'; // yellow
    return undefined;
  };

  const handleSave = () => {
    const updated = { ...markedDates };

    if (totalClasses === 0) {
      delete updated[selectedDate];
    } else {
      updated[selectedDate] = {
        selected: true,
        marked: true,
        selectedColor: getColor(attendedClasses, totalClasses),
        total: totalClasses,
        attended: attendedClasses,
      };
    }

    setMarkedDates(updated);
    saveAttendance(updated);
    setModalVisible(false);
  };

  const getPresentCount = () => {
    return Object.values(markedDates).reduce(
      (acc, d) => acc + (d.attended || 0),
      0,
    );
  };

  const getTotalMarkedDays = () => {
    return Object.values(markedDates).reduce(
      (acc, d) => acc + (d.total || 0),
      0,
    );
  };

  const getAttendancePercentage = () => {
    const total = getTotalMarkedDays();
    const present = getPresentCount();
    if (total === 0) return 0;
    return ((present / total) * 100).toFixed(0);
  };

  const handleClearData = () => {
  Alert.alert(
    "Clear Attendance",
    "Are you sure you want to reset all attendance data for this subject?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem(`attendance_${subject}`);
          setMarkedDates({});
        },
      },
    ]
  );
};


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#f1f5f9" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{subject}</Text>

        <TouchableOpacity onPress={handleClearData}>
          <Ionicons name="reload" size={22} color="#f87171" />
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <Calendar
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={{
          backgroundColor: '#0f172a',
          calendarBackground: '#0f172a',
          textSectionTitleColor: '#94a3b8',
          selectedDayBackgroundColor: '#6366f1',
          selectedDayTextColor: '#fff',
          todayTextColor: '#facc15',
          dayTextColor: '#f1f5f9',
          textDisabledColor: '#334155',
          dotColor: '#6366f1',
          selectedDotColor: '#fff',
          monthTextColor: '#e2e8f0',
          indicatorColor: '#94a3b8',
          arrowColor: '#94a3b8',
          textDayFontWeight: '500',
          textMonthFontWeight: '700',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
      />

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Attendance: {getAttendancePercentage()}% ({getPresentCount()}/
          {getTotalMarkedDays()} classes)
        </Text>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Attendance</Text>

            <Text style={styles.label}>Total Classes</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                onPress={() => setTotalClasses(Math.max(0, totalClasses - 1))}
              >
                <Ionicons name="remove-circle" size={30} color="#ef4444" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{totalClasses}</Text>
              <TouchableOpacity
                onPress={() => setTotalClasses(totalClasses + 1)}
              >
                <Ionicons name="add-circle" size={30} color="#10b981" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Attended</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                onPress={() =>
                  setAttendedClasses(Math.max(0, attendedClasses - 1))
                }
              >
                <Ionicons name="remove-circle" size={30} color="#ef4444" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{attendedClasses}</Text>
              <TouchableOpacity
                onPress={() =>
                  setAttendedClasses(
                    Math.min(totalClasses, attendedClasses + 1),
                  )
                }
              >
                <Ionicons name="add-circle" size={30} color="#10b981" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>
              Missed: {totalClasses - attendedClasses}
            </Text>

            <View style={styles.modalButtons}>
              <Pressable onPress={handleSave} style={styles.saveBtn}>
                <Text style={styles.btnText}>Save</Text>
              </Pressable>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  statsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    marginHorizontal: 20,
  },
  statsText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    width: '85%',
  },
  modalTitle: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 10,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  counterValue: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveBtn: {
    backgroundColor: '#10b981',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cancelBtn: {
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
