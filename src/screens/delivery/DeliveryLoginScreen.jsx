import { Eye, EyeOff, Lock, Phone } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../../utils/Constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { host } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DeliveryLoginScreen() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${host}/api/v1/users/delivery-login`, {
        mobileNo: mobile,
        password,
      });
      await AsyncStorage.setItem('deliveryPartner', mobile);
      navigation.reset({
        index: 0,
        routes: [{ name: 'DeliveryPortalScreen' }],
      });
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Login failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f1f5f9" barStyle="dark-content" />

      <View style={styles.card}>
        <Text style={styles.title}>Delivery Partner Login</Text>

        {/* Mobile Input */}
        <View style={styles.inputContainer}>
          <Phone size={20} color="#64748b" style={styles.icon} />
          <TextInput
            placeholder="Mobile Number"
            placeholderTextColor="#94a3b8"
            maxLength={10}
            keyboardType="phone-pad"
            value={mobile}
            onChangeText={setMobile}
            style={styles.input}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Lock size={20} color="#64748b" style={styles.icon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            {secure ? (
              <EyeOff size={20} color="#64748b" style={styles.icon} />
            ) : (
              <Eye size={20} color="#64748b" style={styles.icon} />
            )}
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          disabled={mobile.length < 10 || loading || !password}
          activeOpacity={0.8}
          style={[
            styles.button,
            {
              backgroundColor:
                mobile.length < 10 || loading || !password
                  ? Colors.disabled
                  : Colors.primary,
            },
          ]}
          onPress={login}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    color: '#1e293b',
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#1e293b',
    height: 48,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    justifyContent: 'center',
    marginTop: 14,
    flexDirection: 'row',
  },
  footerText: {
    fontSize: 16,
    color: '#334155',
  },
  registerLink: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '500',
  },
};
