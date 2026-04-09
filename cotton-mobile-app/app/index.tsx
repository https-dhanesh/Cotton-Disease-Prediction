import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function ImageUploadScreen() {
  // Fix: Explicitly tell TS this is an array of strings
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([result.assets[0].uri]);
    }
  };

  const handleNext = () => {
    if (images.length === 0) {
      Alert.alert('Upload Required', 'Please select a plant image first.');
      return;
    }
    // Pass the URI to the analysis screen
    router.push({ 
      pathname: '/analysis', 
      params: { imageUri: images[0] } 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cotton Health AI</Text>
      <View style={styles.uploadArea}>
        {images.length > 0 ? (
          <Image source={{ uri: images[0] }} style={styles.preview} />
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={pickImage}>
            <Text style={styles.plus}>+</Text>
            <Text style={{ color: '#64748b' }}>Select Cotton Leaf Image</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity 
        style={[styles.btn, images.length === 0 && styles.btnDisabled]} 
        onPress={handleNext}
        disabled={images.length === 0}
      >
        <Text style={styles.btnText}>Analyze Health</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginTop: 60, marginBottom: 40 },
  uploadArea: { width: '100%', height: 350, backgroundColor: '#f1f5f9', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#e2e8f0', borderStyle: 'dashed', overflow: 'hidden' },
  preview: { width: '100%', height: '100%' },
  addButton: { alignItems: 'center' },
  plus: { fontSize: 60, color: '#22c55e', marginBottom: 10 },
  btn: { backgroundColor: '#22c55e', width: '100%', padding: 18, borderRadius: 12, marginTop: 40, elevation: 2 },
  btnDisabled: { backgroundColor: '#cbd5e1' },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }
});