// navigation/BottomTabNavigator.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ShoppingCart, User, Heart, Package } from 'lucide-react-native';

import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import HomeScreen from '../screens/HomeScreen';
import LikesScreen from '../screens/LikesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const CustomHomeButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.customHomeBtn}
    activeOpacity={0.8}
    onPress={onPress}
  >
    {children}
  </TouchableOpacity>
);

const BottomTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FF6B00',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 70,
          position: 'absolute',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: '#fff',
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}
    >
      <Tab.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ focused, color }) => (
            <ShoppingCart color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="OrdersScreen"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color }) => <Package color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: '', // remove label for center button
          tabBarIcon: ({ focused, color }) => (
            <View
              style={[
                styles.homeIconWrapper,
                { backgroundColor: focused ? '#FF6B00' : '#fff' },
              ]}
            >
              <Home color={focused ? '#fff' : color} size={26} />
            </View>
          ),
          tabBarButton: props => <CustomHomeButton {...props} />,
        }}
      />
      <Tab.Screen
        name="LikesScreen"
        component={LikesScreen}
        options={{
          tabBarLabel: 'Likes',
          tabBarIcon: ({ color }) => <Heart color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;

const styles = StyleSheet.create({
  customHomeBtn: {
    top: -5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIconWrapper: {
    width: 65,
    height: 65,
    borderRadius: 40,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,
    elevation: 10,
  },
});
