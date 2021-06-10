import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import PhoneAuthScreen from './screens/LoginScreen'
import ServicesListScreen from './screens/ServicesListScreen'
import ProfileScreen from './screens/ProfileScreen'

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Services'
  switch (routeName) {
    case 'Services':
      return 'सेवा का चयन करें'
    case 'Profile':
      return 'प्रोफ़ाइल'
  }
  return routeName
}

const Tab = createBottomTabNavigator()

function TabNavigator({ navigation, route }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          if (route.name === 'Services') {
            iconName = 'ios-search'
          } else if (route.name === 'Profile') {
            iconName = 'ios-person'
          }
          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
      tabBarOptions={{
        activeTintColor: '#bf923b',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Services"
        options={{ tabBarLabel: 'सेवा का चयन करें' }}
        component={ServicesListScreen}
      />
      <Tab.Screen
        name="Profile"
        options={{ tabBarLabel: 'प्रोफ़ाइल' }}
        component={ProfileScreen}
      />
     <Tab.Screen
          name="Login"
          options={{ title: 'लॉग इन करें' }}
          component={PhoneAuthScreen}
        />
    </Tab.Navigator>
  )
}

const Stack = createStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#bf923b',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Login"
          options={{ title: 'लॉग इन करें' }}
          component={PhoneAuthScreen}
        />
        <Stack.Screen
          name="Tabs"
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
          })}
          component={TabNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})