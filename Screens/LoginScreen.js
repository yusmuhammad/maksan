import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import FCMService from '../services/fcm';  // Pastikan path ke FCMService benar

const LoginScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = 'https://yusril.sikapngalah.com';

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/login.php?password=${password}&table=santri`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setLoading(false);
      console.log(data);
      if (data.status === 'success') {
        const user = data.data[0];

        // Dapatkan token FCM dan simpan ke backend setelah login berhasil
        await FCMService.getTokenAndStore(user.id);

        // Navigasi ke HomeScreen setelah login berhasil
        navigation.replace('HomeScreen', { user });
      } else {
        alert('Login gagal');
      }
    } catch (error) {
      setLoading(false);
      alert('Terjadi kesalahan');
    }
  };

  return (
    <LinearGradient
      colors={['#00CED1', '#00BFFF']} 
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.innerContainer}
      >
        <Image source={require('../assets/asraman.png')} style={styles.logo} />
        <Text style={styles.title}>Login Wali Santri</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            placeholder="Password" 
            secureTextEntry={!passwordVisible}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.visibilityToggle}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Icon name="eye" color="black" size={20} />
          </TouchableOpacity>
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
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    textAlign: 'center',
  },
  visibilityToggle: {
    position: 'absolute',
    right: 15,
    top: 13,
  },
  loginButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    width: '100%',
    height: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
