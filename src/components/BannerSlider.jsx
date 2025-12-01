import React from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

const { width } = Dimensions.get('window');

const bannerImages = [
  require('../assets/images/slider2.jpg'),
  require('../assets/images/slider3.jpg'),
  require('../assets/images/slider1.jpg'),
];

const BannerSlider = () => {
  return (
    <View style={styles.container}>
      <SwiperFlatList
        autoplay
        autoplayDelay={2.5}
        autoplayLoop
        index={0}
        showPagination
        paginationActiveColor="#ff3d00"
        paginationDefaultColor="#ddd"
        paginationStyleItem={{
          width: 8,
          height: 8,
          borderRadius: 4,
        }}
        data={bannerImages}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item} style={styles.image} resizeMode="cover" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  slide: {
    paddingHorizontal: 12,
  },
  image: {
    width: width - 24,
    height: 200,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});

export default BannerSlider;
