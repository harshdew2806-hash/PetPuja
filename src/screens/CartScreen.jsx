import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { Colors, companyLogo, companyName } from '../utils/Constants';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { host } from '../services/api';
import RazorpayCheckout from 'react-native-razorpay';
import FullLoader from '../components/FullLoader';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handlingCharges = 0;
  const deliveryCharges = 0;

  const fetchCart = async () => {
    const storedCart = await AsyncStorage.getItem('cart');
    setCartItems(storedCart ? JSON.parse(storedCart) : []);
  };

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, []),
  );

  const updateCartStorage = async updatedCart => {
    setCartItems(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const increaseQty = id => {
    const updatedCart = cartItems.map(item =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
    );
    updateCartStorage(updatedCart);
  };

  const decreaseQty = id => {
    const updatedCart = cartItems.map(item =>
      item._id === id
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item,
    );
    updateCartStorage(updatedCart);
  };

  const deleteItem = id => {
    Alert.alert('Delete Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedCart = cartItems.filter(item => item._id !== id);
          updateCartStorage(updatedCart);
        },
      },
    ]);
  };

  const getTotal = () => {
    const total = cartItems.reduce(
      (acc, item) => acc + Number(item.price) * item.quantity,
      0,
    );
    return total + handlingCharges + deliveryCharges;
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert(
        'Cart is empty',
        'Please add items to your cart before placing an order.',
      );
      return;
    }
    setIsLoading(true);
    const {
      data: {
        data: { key },
      },
    } = await axios.get(`${host}/api/v1/payments/get-key`);
    console.log('key->', key);

    const {
      data: { data: order },
    } = await axios.post(`${host}/api/v1/payments/order-gen`, {
      amount: getTotal(), // Convert to paise
    });
    console.log('order->', order);

    const options = {
      key: key,
      amount: order.amount,
      currency: 'INR',
      name: companyName,
      description: 'Test Transaction',
      image: companyLogo,
      order_id: order.id,
      prefill: {
        name: `${companyName} User`,
        email: `${companyName.toLowerCase()}@example.com`,
        contact: (await AsyncStorage.getItem('user')) || '9999999999',
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: Colors.primary,
      },
    };

    RazorpayCheckout.open(options)
      .then(async data => {
        // handle success
        setIsLoading(true);
        const {
          data: { data: paymentVerifyRes },
        } = await axios.post(`${host}/api/v1/payments/verify`, {
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_order_id: data.razorpay_order_id,
          razorpay_signature: data.razorpay_signature,
        });
        const response = await axios.post(`${host}/api/v1/orders`, {
          items: cartItems,
          totalAmount: getTotal(),
          user: JSON.parse(await AsyncStorage.getItem('user')),
          paymentId: paymentVerifyRes.razorpay_payment_id,
        });
        if (response.data.success) {
          await AsyncStorage.removeItem('cart');
          setCartItems([]);
          Alert.alert('✅ Order Placed', 'Go to Orders to see details', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate('OrderDetailScreen', {
                  order: response.data.data,
                }),
            },
          ]);
        }
      })
      .catch(error => {
        // handle failure
        console.log(error);
        Alert.alert(
          'Error',
          error?.response?.data?.message || 'Payment failed',
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const COD = async () => {
    if (cartItems.length === 0) {
      Alert.alert(
        'Cart is empty',
        'Please add items to your cart before placing an order.',
      );
      return;
    }
  setIsLoading(true);
    try {
      const response = await axios.post(`${host}/api/v1/orders`, {
        items: cartItems,
        totalAmount: getTotal(),
        user: await AsyncStorage.getItem('user'),
        paymentId: "Bhai ye COD"
      });
      if (response.data.success) {
        await AsyncStorage.removeItem('cart');
        setCartItems([]);
        Alert.alert('✅ Order Placed', 'Go to Orders to see details', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('OrderDetailScreen', {
                order: response.data.data,
              }),
          },
        ]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Order creation failed');
    }finally{
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      {isLoading && (
        <FullLoader loading={isLoading} size="large" color={Colors.primary} />
      )}
      <StatusBar backgroundColor={Colors.primary} barStyle={'light-content'} />
      <Text style={styles.header}>Your Cart</Text>

      <ScrollView style={styles.scroll}>
        {cartItems.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
            Your cart is empty.
          </Text>
        ) : (
          cartItems.map(item => (
            <View key={item._id} style={styles.card}>
              <Pressable
                onPress={() =>
                  navigation.navigate('ProductDetailScreen', { product: item })
                }
              >
                <Image source={{ uri: item.image }} style={styles.image} />
              </Pressable>
              <View style={styles.details}>
                <View style={styles.topRow}>
                  <Text numberOfLines={1} style={styles.name}>
                    {item.name}
                  </Text>
                  <TouchableOpacity onPress={() => deleteItem(item._id)}>
                    <Trash2 color="red" size={20} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.price}>₹{item.price}</Text>
                <View style={styles.controls}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => decreaseQty(item._id)}
                  >
                    <Minus size={16} color={Colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => increaseQty(item._id)}
                  >
                    <Plus size={16} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Handling Charges</Text>
            <Text style={styles.summaryValue}>₹{handlingCharges}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Charges</Text>
            <Text style={styles.summaryValue}>₹{deliveryCharges}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{getTotal()}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.orderButton}
              onPress={placeOrder}
            >
              <Text style={styles.orderButtonText}>Pay Online</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.orderButton}
              onPress={COD}
            >
              <Text style={styles.orderButtonText}>COD</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    padding: 16,
    backgroundColor: Colors.primary,
    color: '#fff',
  },
  scroll: {
    flex: 1,
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 8,
    marginRight: 14,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: 'bold',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qty: {
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
    color: '#333',
  },
  qtyBtn: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    padding: 4,
  },
  summary: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 75,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#555',
  },
  summaryValue: {
    fontSize: 14,
    color: '#555',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  orderButton: {
    marginTop: 12,
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});