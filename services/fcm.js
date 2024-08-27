import messaging from '@react-native-firebase/messaging';

const FCMService = {
  getTokenAndStore: async (userId) => {
    try {
      // Meminta izin untuk menerima notifikasi
      const authorizationStatus = await messaging().requestPermission();

      if (authorizationStatus) {
        // Mendapatkan token FCM
        const fcmToken = await messaging().getToken();

        if (fcmToken) {
          console.log('FCM Token:', fcmToken);

          // Kirim token ke backend untuk disimpan
          await FCMService.saveTokenToBackend(fcmToken, userId);
        }
      } else {
        console.log('Permission not granted for messaging');
      }
    } catch (error) {
      console.error('Error in getTokenAndStore:', error);
    }
  },

  saveTokenToBackend: async (token, userId) => {
    try {
      // Kirim token ke backend menggunakan GET
      const response = await fetch(`https://yusril.sikapngalah.com/api/fcm.php?token=${encodeURIComponent(token)}&userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
      });

      const data = await response.json();
      console.log('Token saved successfully:', data);
    } catch (error) {
      console.error('Error saving token to backend:', error);
    }
  },

  initializeTokenRefreshListener: () => {
    messaging().onTokenRefresh(async (newToken) => {
      console.log('FCM Token refreshed:', newToken);
      // Langsung kirim token baru ke backend tanpa menyimpan di local storage
      const userId = "user_id"; // Gantilah ini dengan cara Anda mendapatkan userId
      if (userId) {
        await FCMService.saveTokenToBackend(newToken, userId);
      }
    });
  },
};

export default FCMService;
