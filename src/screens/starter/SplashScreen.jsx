import { View, Text, Button, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen() {
  const navigation = useNavigation();
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchTokens = async () => {};

    const startAnimation = () => {
      Animated.timing(animation, {
        toValue: 2.5,
        duration: 1300,
        useNativeDriver: true,
      }).start(async () => {
        // Navigate to DrawerNavigator after the animation completes
        const isFirstVisiting = await AsyncStorage.getItem('isFirstVisiting');
        if (!isFirstVisiting) {
          console.log('this is called');
          await AsyncStorage.setItem('isFirstVisiting', "ho gya");
          navigation.reset({
            index: 0,
            routes: [{ name: 'EngageScreen1' }],
          });
        } else {
          const user = await AsyncStorage.getItem('user');
          const deliveryPartner = await AsyncStorage.getItem('deliveryPartner');
          if (user) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'BottomTabNavigation' }],
            });
          } else if (deliveryPartner) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'DeliveryPortalScreen' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'CustomerLoginScreen' }],
            });
          }
        }
      });
    };

    // Start fetching tokens first (async)
    fetchTokens();
    // Immediately start animation after initiating fetch
    startAnimation();
  }, [animation]);

  return (
    <View
      style={{
        height: '100%',
        backgroundColor: 'rgb(255,253,250)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Animated.Image
        style={[
          { height: 120, width: 220 },
          {
            transform: [
              {
                scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1.5],
                }),
              },
            ],
          },
        ]}
        resizeMode="contain"
        source={require('../../assets/images/logo.png')}
      />
    </View>
  );
}
