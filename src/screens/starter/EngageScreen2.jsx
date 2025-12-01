import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../utils/Constants';


export default function EngageScreen2() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Illustration */}
      <Image
        source={require('../../assets/images/img2.jpeg')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
      </View>

      {/* Bottom Section with Gradient */}
      <LinearGradient
        colors={[Colors.primary, Colors.primary_light]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={styles.bottomContainer}
      >
        <Text style={styles.title}>Discover Products & Hot Deals</Text>
        <Text style={styles.subtitle}>
          Explore Trending Products And Exclusive Offers From Nearby Shops.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.nextButton]}
          onPress={() => navigation.navigate('EngageScreen3')}
        >
          <Text>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'CustomerLoginScreen' }],
            })
          }
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 450,
    marginTop: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: '#f5b700',
    width: 16,
  },
  bottomContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
    // justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    textAlign: 'center',
    marginVertical: 12,
  },
  nextButton: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 16,
  },
  nextText: {
    color: '#1a3c78',
    fontSize: 16,
    fontWeight: '600',
  },
  skipText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});
