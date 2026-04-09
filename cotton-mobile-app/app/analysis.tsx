import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Constants from 'expo-constants';

export default function AnalysisScreen() {
  // Fix: Tell TS that imageUri is a string
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();

  useEffect(() => {
    const runAnalysis = async () => {
      if (!imageUri) return;

      try {
        const formData = new FormData();
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const extension = filename.split('.').pop();
        const type = `image/${extension}`;

        formData.append('file', { 
          uri: imageUri, 
          name: filename, 
          type 
        } as any);

        const host = '10.208.137.17'; 
        const response = await fetch(`http://${host}:8000/analyze`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!response.ok) throw new Error('Model server is not responding');

        const data = await response.json();

        // Pass results to the next screen (params must be strings)
        router.replace({
          pathname: '/results',
          params: { 
            status: data.status, 
            duration: data.spray_time_seconds.toString(),
            confidence: data.confidence 
          }
        });
      } catch (e: any) {
        Alert.alert("Connection Failed", "Ensure your Python app.py is running on port 8000.");
        router.back();
      }
    };

    runAnalysis();
  }, [imageUri]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#22c55e" />
      <Text style={styles.text}>Processing through AI Model...</Text>
      <Text style={styles.subtext}>Identifying disease and calculating spray time</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { marginTop: 20, fontSize: 18, fontWeight: '600', color: '#1e293b' },
  subtext: { marginTop: 8, fontSize: 14, color: '#64748b' }
});