import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import { Colors } from '../../utils/Constants';
import { DiamondPlus, LogOut, NotebookPen } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { host } from '../../services/api';
import FullLoader from '../../components/FullLoader';

export default function MyDeliveryScreen() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const deliveryPartner = await AsyncStorage.getItem('deliveryPartner');
      const response = await axios.post(
        `${host}/api/v1/orders/delivery-partner`,
        {
          deleveryPartner: deliveryPartner,
        },
      );
      console.log(response);
      setOrders(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.orderId}>{item._id}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>
      <Text style={styles.info}>Date: {item.createdAt?.substring(0, 10)}</Text>
      <Text style={styles.info}>Mobile: {item.user}</Text>
      <Text style={styles.info}>Items: {item.items?.length}</Text>
      <Text style={styles.info}>Total: {item.totalAmount}</Text>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.acceptButton, { backgroundColor: Colors.secondary }]}
        onPress={() =>
          navigation.navigate('OrderDetailScreen', { order: item })
        }
      >
        <Text style={styles.acceptText}>go to delivery</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={orders}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchOrders} />
        }
        keyExtractor={item => item.orderId}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
    padding: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  status: {
    color: Colors.primary,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  acceptButton: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  acceptText: {
    color: '#fff',
    fontWeight: '600',
  },
});
