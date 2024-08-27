import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, Animated } from 'react-native';
import { RNCamera } from 'react-native-camera'; // Import RNCamera from react-native-camera
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient

const PetugasScreen = () => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [loading, setLoading] = useState(false); // Tambahkan state loading
  const [animation] = useState(new Animated.Value(0)); // State untuk animasi
  const API_BASE_URL = 'https://yusril.sikapngalah.com';

  const handleLogin = async () => {
    setLoading(true); // Set loading ke true saat proses dimulai
    try {
      const response = await fetch(`${API_BASE_URL}/api/login.php?password=${password}&table=petugas`);
      const data = await response.json();
      if (data.status === 'success') {
        setIsLoggedIn(true);
        setHasPermission(true); // Set permission as granted after login
      } else {
        Alert.alert('Password salah');
        // Tidak perlu setHasPermission(true) di sini
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Terjadi kesalahan');
    } finally {
      setLoading(false); // Set loading ke false setelah proses selesai
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setScannedData(data);
    setLoading(true); // Set loading ke true saat proses dimulai
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(); // Mulai animasi card

    try {
      const response = await fetch(`${API_BASE_URL}/api/ambil.php?id=${data}`);
      const json = await response.json();
      console.log(json);
      if (json.status === 'success') {
        Alert.alert(json.message);
      } else {
        Alert.alert(json.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Terjadi kesalahan');
    } finally {
      setLoading(false); // Set loading ke false setelah proses selesai
    }
  };

  const animatedCardStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
    ],
    opacity: animation,
  };

  if (!isLoggedIn) {
    return (
      <LinearGradient
      colors={['#00CED1', '#00BFFF']}
        style={styles.container}
      >
        <Image source={require('../assets/asraman.png')} style={styles.logo} />
        <Text style={styles.title}>Login Petugas</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          <LinearGradient
            colors={['#007bff', '#0056b3']}
            style={styles.buttonGradient}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  if (hasPermission === null) {
    return <Text>Meminta izin untuk menggunakan kamera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Tidak ada akses ke kamera</Text>;
  }

  return (
    <View style={styles.container}>
      <RNCamera
        style={StyleSheet.absoluteFillObject}
        onBarCodeRead={scanned ? undefined : handleBarCodeScanned}
        captureAudio={false}
      />
      {scanned && (
        <TouchableOpacity style={styles.scanButton} onPress={() => setScanned(false)}>
          <Text style={styles.buttonText}>Tap untuk scan lagi</Text>
        </TouchableOpacity>
      )}
      {scannedData && (
        <Animated.View style={[styles.card, animatedCardStyle]}>
          <Text style={styles.scannedText}>Data yang discan: {scannedData}</Text>
        </Animated.View>
      )}
      {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loading} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    width: '100%',
    height: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff', // Warna teks putih agar kontras dengan gradien
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    textAlign: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#000', // Warna teks hitam
  },
  loginButton: {
    width: '100%',
    height: 50,

    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanButton: {
    position: 'absolute',
    bottom: 20,
    width: '90%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  card: {
    position: 'absolute',
    bottom: 80,
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  scannedText: {
    fontSize: 16,
    color: '#333',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
  },
});

export default PetugasScreen;
