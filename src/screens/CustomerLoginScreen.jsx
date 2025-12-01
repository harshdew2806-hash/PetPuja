import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import useKeyboardOffsetHeight from '../utils/useKeyboardOffsetHeight';
import { Colors } from '../utils/Constants';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bike } from 'lucide-react-native';

export default function CustomerLoginScreen() {
  const keyboardHeight = useKeyboardOffsetHeight();
  const translateY = useRef(new Animated.Value(0)).current;
  const [mobileNumber, setMobileNumber] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: keyboardHeight === 0 ? 0 : -keyboardHeight * 0.9,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [keyboardHeight]);

  const handleLogin = () => {
    setLoading(true);
    if (mobileNumber.length !== 10) {
      Alert.alert(
        'Invalid Number',
        'Please enter a valid 10-digit mobile number',
      );
      setLoading(false);
      return;
    }
    setTimeout(async () => {
      // store user data in AsyncStorage
      await AsyncStorage.setItem('user', mobileNumber);
      // Navigate to DrawerNavigator after the animation completes
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTabNavigation' }],
      });
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, gap: 30 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate("DeliveryLoginScreen")}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            padding: 10,
            backgroundColor: '#d6d6d6',
            borderRadius: 10,
          }}
        >
          <Bike size={25} />
        </TouchableOpacity>
        
        <Image
          source={require('../assets/images/login.jpeg')}
          style={styles.image}
        />

        <Animated.View style={[{}, { transform: [{ translateY }] }]}>
          <LinearGradient
            colors={[
              'rgba(255, 255, 255,0)',
              'white',
              'white',
              'white',
              'white',
              'white',
              'white',
              'white',
              'white',
            ]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.formContainer}
          >
            <Text style={styles.title}>Welcome Buddy!</Text>
            <Text style={styles.subtitle}>
              Enter your mobile number to get started
            </Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                placeholder="Enter mobile number"
                placeholderTextColor="#999"
                style={styles.input}
                keyboardType="number-pad"
                maxLength={10}
                value={mobileNumber}
                onChangeText={setMobileNumber}
              />
            </View>

            <TouchableOpacity
              disabled={mobileNumber.length < 10 || loading}
              activeOpacity={0.8}
              style={[
                styles.button,
                {
                  backgroundColor:
                    mobileNumber.length < 10 || loading
                      ? Colors.disabled
                      : Colors.primary,
                },
              ]}
              onPress={handleLogin}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.terms}>
              By continuing, you agree to our{' '}
              <Text style={styles.linkText}>Terms & Policy</Text>
            </Text>
          </LinearGradient>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  image: {
    width: '100%',
    height: 430,
    resizeMode: 'contain',
    marginTop: 50,
  },
  formContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: Colors.primary,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 6,
    marginBottom: 15,
    width: '100%',
  },
  countryCode: {
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  terms: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },
  linkText: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});
