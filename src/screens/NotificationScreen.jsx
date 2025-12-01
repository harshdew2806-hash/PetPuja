import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';

const dummyNotifications = [
  {
    id: '1',
    title: 'Order Shipped',
    message: 'Your order #12345 has been shipped.',
    time: 'Just now',
  },
  {
    id: '2',
    title: 'Welcome!',
    message: 'Thanks for signing up. Let’s get started!',
    time: '2 hrs ago',
  },
  {
    id: '3',
    title: 'Promo Alert',
    message: 'Get 20% off on your next order. Use code WELCOME20.',
    time: 'Yesterday',
  },
  {
    id: '4',
    title: 'New Feature',
    message: 'You can now track your orders in real-time.',
    time: '2 days ago',
  },
];

export default function NotificationScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Bell size={20} color="#4f46e5" />
      </View>
      <View style={styles.textContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  iconWrap: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderRadius: 25,
    width: 40,
    height: 40,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    color: '#111',
  },
  message: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
});
