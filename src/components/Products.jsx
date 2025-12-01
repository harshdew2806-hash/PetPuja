import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../utils/Constants';

const Products = ({ products }) => {
  const navigation = useNavigation();
  const [likedProducts, setLikedProducts] = useState([]);

  // Load liked products (full object) from AsyncStorage
  useEffect(() => {
    const loadLikes = async () => {
      try {
        const storedLikes = await AsyncStorage.getItem('liked_products');
        const parsedLikes = storedLikes ? JSON.parse(storedLikes) : [];
        setLikedProducts(parsedLikes);
      } catch (error) {
        console.log('Error loading liked products:', error);
      }
    };

    loadLikes();
  }, []);

  // Toggle like/unlike for full product object
  const toggleLike = async (product) => {
    try {
      const exists = likedProducts.find((p) => p._id === product._id);
      let updatedLikes;

      if (exists) {
        // Remove product from liked list
        updatedLikes = likedProducts.filter((p) => p._id !== product._id);
      } else {
        // Add product to liked list
        updatedLikes = [...likedProducts, product];
      }

      setLikedProducts(updatedLikes);
      await AsyncStorage.setItem('liked_products', JSON.stringify(updatedLikes));
    } catch (error) {
      console.log('Error toggling like:', error);
    }
  };

  // Add to cart
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

  // Render single product
  const renderProduct = ({ item }) => {
    const isLiked = likedProducts.some((p) => p._id === item._id);

    return (
      <View style={styles.productCard}>
        <Pressable
          onPress={() =>
            navigation.push('ProductDetailScreen', { product: item })
          }
        >
          <Image source={{ uri: item.image }} style={styles.productImage} />
        </Pressable>

        <TouchableOpacity
          onPress={() => toggleLike(item)}
          style={styles.likeButton}
        >
          <Text style={{ fontSize: 18 }}>{isLiked ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDesc}>{item.description}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item._id || item.id}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperStyle={{
        justifyContent: 'space-between',
        paddingHorizontal: 10,
      }}
    />
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    color: '#333',
  },
  productDesc: {
    fontSize: 12,
    height: 25,
    color: '#666',
    marginVertical: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  addButton: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  likeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor:"#fff",
    borderRadius:50,
    padding:4,
    justifyContent:"center",
    alignItems:"center",
    elevation:5,
    zIndex: 10,
  },
});

export default Products;
