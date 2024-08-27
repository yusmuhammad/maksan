import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen1 = ({ navigation }) => {

  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const handlePetugasLogin = () => {
    navigation.navigate('PetugasScreen');
  };

  return (
    <LinearGradient
    colors={['#00CED1', '#00BFFF']}  // Gradien hijau ke kuning
      style={styles.container}
    >
      <Image
        source={require('../assets/asraman.png')} // Ganti dengan path logo atau gambar splash screen
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.card}>
        <Text style={styles.text}>Aplikasi Kupon Makan</Text>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <LinearGradient
            colors={['#007bff', '#0056b3']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Login Walisantri</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handlePetugasLogin}>
          <LinearGradient
            colors={['#007bff', '#0056b3']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Login Petugas</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 20,

    alignItems: 'center',



  },
  text: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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

export default SplashScreen1;
