import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ref, set } from 'firebase/database';
import { database } from '../constants/firebaseConfig';

export default function ResultsScreen() {
  // Fix: Explicitly type the incoming parameters
  const params = useLocalSearchParams<{ status: string, duration: string, confidence: string }>();
  const router = useRouter();
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  const startSprayer = () => {
    // Fix: Fallback to "0" if duration is missing
    const durationSeconds = parseInt(params.duration || "0");

    if (durationSeconds === 0) {
      Alert.alert("No Action Needed", "The plant appears healthy. No spray required.");
      return;
    }

    // Set 'sprayer' to 1 in Firebase for the mini car
    set(ref(database, 'sprayer'), 1)
      .then(() => {
        setTimeLeft(durationSeconds);
        setIsActive(true);
      })
      .catch((err) => Alert.alert("Firebase Error", err.message));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Turn off the pump in Firebase
      set(ref(database, 'sprayer'), 0);
      setIsActive(false);
      Alert.alert("Complete", "Spray treatment finished successfully.");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>AI IDENTIFICATION</Text>
        <Text style={styles.status}>{params.status?.replace('_', ' ').toUpperCase()}</Text>
        <Text style={styles.confidence}>Confidence: {params.confidence}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.label}>REQUIRED TREATMENT</Text>
        <Text style={styles.duration}>{params.duration} Seconds</Text>
      </View>

      {isActive ? (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timeLeft}s</Text>
          <Text style={{ color: '#22c55e', fontWeight: 'bold' }}>CAR IS SPRAYING...</Text>
        </View>
      ) : (
        <View style={{ width: '100%' }}>
          <TouchableOpacity style={styles.primaryBtn} onPress={startSprayer}>
            <Text style={styles.btnText}>Start Mini Car Sprayer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.replace('/')}>
            <Text style={[styles.btnText, { color: '#64748b' }]}>New Analysis</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: '#f8fafc', justifyContent: 'center' },
  card: { backgroundColor: '#fff', padding: 30, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, alignItems: 'center' },
  label: { fontSize: 12, color: '#94a3b8', letterSpacing: 1.5, marginBottom: 10 },
  status: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 5 },
  confidence: { fontSize: 16, color: '#22c55e', marginBottom: 20 },
  divider: { height: 1, width: '100%', backgroundColor: '#f1f5f9', marginBottom: 20 },
  duration: { fontSize: 40, fontWeight: 'bold', color: '#3b82f6' },
  timerContainer: { marginTop: 40, alignItems: 'center' },
  timerText: { fontSize: 80, fontWeight: 'bold', color: '#22c55e' },
  primaryBtn: { backgroundColor: '#22c55e', padding: 20, borderRadius: 15, marginTop: 40, width: '100%' },
  secondaryBtn: { padding: 20, marginTop: 10, width: '100%', alignItems: 'center' },
  btnText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }
});