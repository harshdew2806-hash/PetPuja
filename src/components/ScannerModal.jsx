import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

export default function ScannerModal({ visible, onClose, onScanSuccess }) {
  return (
    <Modal visible={visible} animationType="slide">
      <QRCodeScanner
        onRead={onScanSuccess}
        flashMode={RNCamera.Constants.FlashMode.auto}
        reactivate={false}
        showMarker={true}
        topContent={
          <Text style={styles.centerText}>Scan QR to verify the order</Text>
        }
        bottomContent={
          <TouchableOpacity onPress={onClose} style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        }
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerText: {
    fontSize: 16,
    color: '#333',
    paddingTop: 20,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 17,
    color: 'white',
    fontWeight: '600',
  },
  buttonTouchable: {
    marginTop: 20,
    backgroundColor: '#f45b69',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
