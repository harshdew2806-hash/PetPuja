import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { host } from '../../services/api';
import { Colors } from '../../utils/Constants';

const AddProductScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        console.log("this is response-> ",response);
        const asset = response.assets[0];
        setImage(asset);
      }
    });
  };

  const handleSubmit = async () => {
    if (!name || !description || !price || !image) {
      Alert.alert('Error', 'All fields including image are required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('productImage', {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.fileName || 'upload.jpg',
    });

    try {
      setUploading(true);
      const res = await axios.post(`${host}/api/v1/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(res);
      Alert.alert('Success', 'Product created successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setImage(null);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />

        <TextInput
          style={styles.input}
          placeholder="Price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.image} />
          ) : (
            <Text style={styles.imageText}>Pick an Image</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: uploading ? Colors.disabled : Colors.primary },
          ]}
          onPress={handleSubmit}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size={'small'} color={'#fff'} />
          ) : (
            <Text style={styles.submitButtonText}>Add Product</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  imagePicker: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imageText: {
    color: '#999',
  },
  submitButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
