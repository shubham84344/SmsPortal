import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator';
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </>
  );
}
