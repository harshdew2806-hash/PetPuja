import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Products from '../components/Products'; // Adjust path if needed
import { host } from '../services/api';
import { Colors } from '../utils/Constants';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${host}/api/v1/products`);
      setProducts(response.data.data);
      setFiltered(response.data.data);
      console.log('Fetched products:', response.data.data);
    } catch (error) {
      console.log('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = text => {
    setQuery(text);
    if (!text.trim()) {
      setFiltered(products);
      return;
    }
    const lower = text.toLowerCase();
    const results = products.filter(
      item =>
        item.name.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower),
    );
    setFiltered(results);
  };

  return (
    <>
      <View
        style={{
          paddingHorizontal: 12,
          paddingTop: 20,
          backgroundColor: Colors.primary,
        }}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or description..."
          value={query}
          autoFocus
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4f46e5"
            style={{ marginTop: 20 }}
          />
        ) : filtered.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Products products={filtered} scroll={false} />
          </ScrollView>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No products found.</Text>
          </View>
        )}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111',
  },
  searchInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    elevation: 2,
    marginBottom: 20,
  },
  emptyBox: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
});
