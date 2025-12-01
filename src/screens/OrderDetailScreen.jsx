import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../utils/Constants';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { host } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FullLoader from '../components/FullLoader';

export default function OrderDetailScreen() {
  const route = useRoute();
  const [order, setOrder] = useState(route.params?.order);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [deliveryPartner, setDeliveryPartner] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setDeliveryPartner(await AsyncStorage.getItem('deliveryPartner'));
      setUser(await AsyncStorage.getItem('user'));
    })();
  }, []);
  
  const fetchOrderDetails = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`${host}/api/v1/orders/${order._id}`);
      setOrder(response.data.data);
      console.log('Order details fetched:', response.data.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'complete':
        return 'green';
      case 'pending':
        return 'orange';
      case 'accept':
        return 'blue';
      case 'reject':
        return 'red';
      default:
        return '#555';
    }
  };

  const formatDate = isoDate => {
    const date = new Date(isoDate);
    return `${date.toDateString()} at ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  const verifyOrder = async () => {
    try {
      setLoading(true);
      await axios.put(`${host}/api/v1/orders/${order._id}/verify`);
      const dummyOrder = { ...order, status: 'complete' };
      setOrder(dummyOrder);
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };
  console.log(user);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Order Details</Text>
      </View>
      {loading && <FullLoader loading={loading} />}
      {order && (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchOrderDetails}
            />
          }
          contentContainerStyle={styles.container}
        >
          {/* Order Meta Info */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>🗓️ Order Date</Text>
            <Text style={styles.sectionValue}>
              {formatDate(order.createdAt)}
            </Text>

            <Text style={styles.sectionLabel}>💳 Payment ID</Text>
            <Text style={styles.sectionValue}>{order.paymentId}</Text>

            <Text style={styles.sectionLabel}>📦 Status</Text>
            <Text
              style={[
                styles.sectionValue,
                { color: getStatusColor(order.status), fontWeight: '700' },
              ]}
            >
              {order.status.toUpperCase()}
            </Text>

            {order.deleveryPartner && (
              <>
                <Text style={styles.sectionLabel}>🚚 Delivery Partner</Text>
                <Text style={styles.sectionValue}>{order.deleveryPartner}</Text>
              </>
            )}

            <Text style={styles.sectionLabel}>👤 Ordered By</Text>
            <Text style={styles.sectionValue}>{order.user}</Text>
          </View>

          {/* Order Items */}
          <Text style={styles.subHeading}>Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
                <Text style={styles.itemPrice}>
                  ₹{item.price} × {item.quantity}
                </Text>
              </View>
            </View>
          ))}

          {/* Total Amount */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total Amount:</Text>
            <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>
          </View>

          {/* QR Code OR Button */}
          {user && (
            <View style={styles.qrSection}>
              <Text style={styles.sectionLabel}>Scan QR to View Order</Text>
              <Image source={{ uri: order.qrImgUrl }} style={styles.qrImage} />
            </View>
          )}
          {deliveryPartner && order.status !== 'complete' && (
            <TouchableOpacity
              onPress={verifyOrder}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.primary,
                paddingVertical: 10,
                width: '100%',
                paddingHorizontal: 16,
                borderRadius: 8,
                alignSelf: 'center',
                marginTop: 20,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                Scan QR to Verify Order
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  container: {
    padding: 16,
    backgroundColor: '#F5F6FA',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
  },
  sectionValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#222',
  },
  itemCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 1,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  itemDesc: {
    fontSize: 13,
    color: '#666',
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  totalContainer: {
    marginTop: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 1,
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  qrSection: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  qrImage: {
    width: 140,
    height: 140,
    marginTop: 12,
  },
});
