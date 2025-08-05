import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';
//safe-area-view
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
//navigator
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './src/navigator/Navigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
