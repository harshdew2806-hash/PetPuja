import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Pencil,
  Moon,
  ShoppingCart,
  Wallet,
  Gift,
  MapPin,
  Receipt,
  LogOut,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { companyName } from '../utils/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      setUser(await AsyncStorage.getItem('user'));
    })();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      // Navigate to login screen or perform any other logout actions
      navigation.reset({
        index: 0,
        routes: [{ name: 'CustomerLoginScreen' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        paddingVertical: 20,
        paddingHorizontal: 15,
      }}
    >
      {/* Edit Button */}
      <View style={{ position: 'absolute', zIndex: 1, right: 30, top: 20 }}>
        <TouchableOpacity onPress={() => {}}>
          <Pencil size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: 'https://img.freepik.com/premium-vector/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4215.jpg',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{companyName} User</Text>
        <Text style={styles.email}>{companyName}@example.com</Text>
        <Text style={styles.mobile}>+91 {user ? user : '1234567890'}</Text>
      </View>

      {/* Options List */}
      <View style={styles.section}>
        <ProfileOption
          icon={<Moon size={22} color="#555" />}
          label="Change Theme"
          value="light"
        />
        <ProfileOption
          icon={<ShoppingCart size={22} color="#555" />}
          label="Total Orders"
        />
        <ProfileOption
          icon={<Wallet size={22} color="#555" />}
          label="Credits"
        />
        <ProfileOption icon={<Gift size={22} color="#555" />} label="Rewards" />
        <ProfileOption
          icon={<MapPin size={22} color="#555" />}
          label="Shipping Address"
        />
        <ProfileOption
          icon={<Receipt size={22} color="#555" />}
          label="Feedback"
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={() => {
          Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: handleLogout },
          ]);
        }}
        style={styles.logoutButton}
      >
        <LogOut size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const ProfileOption = ({ icon, label, value }) => (
  <TouchableOpacity style={styles.option}>
    {icon}
    <View style={styles.optionText}>
      <Text style={styles.optionLabel}>{label}</Text>
      {value && <Text style={styles.optionValue}>{value}</Text>}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#777',
  },
  mobile: {
    fontSize: 14,
    color: '#777',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 20,
    elevation: 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  optionText: {
    marginLeft: 15,
  },
  optionLabel: {
    fontSize: 16,
    color: '#333',
  },
  optionValue: {
    fontSize: 14,
    color: '#999',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e53935',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
