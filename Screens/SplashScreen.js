import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

// Impor gambar dari folder assets
const splashImage = require('../assets/asraman.png');

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Navigate to the next screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('SplashScreen1'); // Ganti dengan nama screen selanjutnya
    }, 3000); // 3 detik

    // Cleanup timer if the component unmounts
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00CED1', '#00BFFF']} 
        style={styles.gradient}
      >
        <View style={styles.textContainer}>
          <Image
            source={splashImage}
            style={styles.image}
          />
         
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.50,
    height: height * 0.25,
    resizeMode: 'cover',
  },
  textContainer: {
    marginTop: 150,
    position: 'absolute',
    bottom: height * 0.35, // Sesuaikan posisi teks jika perlu
    alignItems: 'center',
  },
 
});

export default SplashScreen;
