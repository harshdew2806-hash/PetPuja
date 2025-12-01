import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../utils/Constants';
import { host } from '../services/api';
import Products from '../components/Products';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;
  const [products, setProducts] = useState([]);

  const images = Array(5).fill(product.image);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${host}/api/v1/products`);
      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      let cart = storedCart ? JSON.parse(storedCart) : [];

      const index = cart.findIndex((item) => item._id === product._id);

      if (index !== -1) {
        Alert.alert(
          'Already in Cart',
          'This item is already in your cart. Do you want to increase the quantity?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Yes',
              onPress: async () => {
                cart[index].quantity += 1;
                await AsyncStorage.setItem('cart', JSON.stringify(cart));
              },
            },
          ]
        );
      } else {
        const productToAdd = {
          ...product,
          quantity: 1,
        };
        cart.push(productToAdd);
        await AsyncStorage.setItem('cart', JSON.stringify(cart));
      }
    } catch (error) {
      console.log('Error adding to cart:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Horizontal Image Slider */}
      <FlatList
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.productImage} />
        )}
        pagingEnabled
        style={styles.slider}
      />

      {/* Thumbnail Images */}
      <FlatList
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `thumb-${index}`}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.thumbnailImage} />
        )}
        contentContainerStyle={styles.thumbnailContainer}
      />

      {/* Details */}
      <View style={styles.detailContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>{product.price}</Text>
        <Text style={styles.productDesc}>{product.description}</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(product)}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>

      {/* Similar Products */}
      <Text style={styles.similarTitle}>Similar Products</Text>
      <Products products={products} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slider: {
    marginTop: 10,
  },
  productImage: {
    width,
    height: 250,
    resizeMode: 'cover',
  },
  thumbnailContainer: {
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  thumbnailImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  detailContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.secondary,
    marginVertical: 8,
  },
  productDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  similarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
  },
});
