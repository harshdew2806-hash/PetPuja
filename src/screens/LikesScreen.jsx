import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Products from '../components/Products'; // Adjust the path as needed
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../utils/Constants';

export default function LikesScreen() {
  const [likedProducts, setLikedProducts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchLikedProducts = async () => {
        try {
          const storedLikes = await AsyncStorage.getItem('liked_products');
          const parsedLikes = storedLikes ? JSON.parse(storedLikes) : [];
          setLikedProducts(parsedLikes);
        } catch (error) {
          console.log('Error loading liked products:', error);
        }
      };

      fetchLikedProducts();
    }, []),
  );

  return (
    <>
      <Text style={styles.heading}>Liked Products</Text>
      <ScrollView style={styles.container}>
        {likedProducts.length > 0 ? (
          <Products products={likedProducts} scroll={false} />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No liked products found.</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    padding: 16,
    backgroundColor: Colors.primary,
    color: '#fff',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
  },
});
