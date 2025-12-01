import { View, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import { Colors } from '../utils/Constants';

const FullLoader = ({ loading, size = 'large', color = Colors.primary }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={loading}>
      <View
        style={[styles.container, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
      >
        <ActivityIndicator size={size} color={color} />
      </View>
    </Modal>
  );
};

export default FullLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
