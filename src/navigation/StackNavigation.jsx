import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomerLoginScreen from '../screens/CustomerLoginScreen';
import DeliveryLoginScreen from '../screens/delivery/DeliveryLoginScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SearchScreen from '../screens/SearchScreen';
import BottomTabNavigation from './BottomTabNavigation';
import DeliveryPortalScreen from '../screens/delivery/DeliveryPortalScreen';
import AddProductScreen from '../screens/delivery/AddProductScreen';
import SplashScreen from '../screens/starter/SplashScreen';
import EngageScreen1 from '../screens/starter/EngageScreen1';
import EngageScreen2 from '../screens/starter/EngageScreen2';
import EngageScreen3 from '../screens/starter/EngageScreen3';
import MyDeliveryScreen from '../screens/delivery/MyDeliveryScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Stack = createNativeStackNavigator();
export default function StackNavigation() {
  //   Splash
  //   Engage1
  //   Engage2
  //   Engage3
  //   Clogin
  //   Dlogin
  //   OrderDetailScreen
  //   productdetailsScreen
  //   SearchScreen
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EngageScreen1"
        component={EngageScreen1}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EngageScreen2"
        component={EngageScreen2}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="EngageScreen3"
        component={EngageScreen3}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="CustomerLoginScreen"
        component={CustomerLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeliveryLoginScreen"
        component={DeliveryLoginScreen}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="DeliveryPortalScreen"
        component={DeliveryPortalScreen}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="MyDeliveryScreen"
        component={MyDeliveryScreen}
        options={{
          headerShown: true,
          title: 'My Deliveries',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          headerShown: true,
          title: 'Notifications',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="AddProductScreen"
        component={AddProductScreen}
        options={{
          headerShown: true,
          title: 'Add Product',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="OrderDetailScreen"
        component={OrderDetailScreen}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false, animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="BottomTabNavigation"
        component={BottomTabNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
