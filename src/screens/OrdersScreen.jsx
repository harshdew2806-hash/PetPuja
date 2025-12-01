import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { ArrowRight } from 'lucide-react-native';
import { Colors } from '../utils/Constants';
import axios from 'axios';
import { host } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const respose = await axios.post(`${host}/api/v1/orders/user`, {
        user: await AsyncStorage.getItem('user'),
      });
      console.log('getting order from backend ==> ', respose);
      setOrders(respose.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    console.log('Refreshing orders...');
    await fetchOrders();
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );
  return (
    <>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <Text style={styles.heading}>My Orders</Text>

      <View style={styles.container}>
        <FlatList
          data={orders}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={{ position: 'absolute', top: 5, right: 8 }}>
                {item?.createdAt?.slice(0, 10)}
              </Text>
              <View style={styles.cardContent}>
                <Text style={styles.orderId}>#{item._id}</Text>
                <Text style={styles.items}>Items: {item?.items?.length}</Text>
                <Text style={styles.status}>Status: {item.status}</Text>
                <Text style={styles.amount}>Amount: {item.totalAmount}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('OrderDetailScreen', { order: item })} style={styles.button}>
                <ArrowRight color="white" size={20} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    padding: 16,
    backgroundColor: Colors.primary,
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    position: 'relative',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  items: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    fontSize: 14,
    color: '#888',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginTop: 4,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 8,
    marginLeft: 10,
  },
});
