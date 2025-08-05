// components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Header({ title, toggleTheme, isDark }) {
  return (
    <View style={[styles.header, isDark && styles.headerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
      <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
        <Ionicons
          name={isDark ? 'sunny-outline' : 'moon-outline'}
          size={24}
          color={isDark ? '#ffd700' : '#333'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 4,
  },
  headerDark: {
    backgroundColor: '#1c1c1e',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  titleDark: {
    color: '#f2f2f2',
  },
  iconButton: {
    position: 'absolute',
    right: 16,
  },
});
