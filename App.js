import React, { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import SplashScreen from './Screens/SplashScreen';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import Totalkupon from './Screens/Totalkupon';
import Notifikasi from './Screens/Notifikasi';
import PetugasScreen from './Screens/PetugasScreen';
import SplashScreen1 from './Screens/SplashScreen1';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    // Konfigurasi push notifications
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // Tampilkan alert dengan detail notifikasi
        Alert.alert(
          notification.title || 'Notification',
          notification.message || 'You have a new notification!',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );

        // Tangani notifikasi dan perbarui badge
        PushNotification.getApplicationIconBadgeNumber((badgeCount) => {
          PushNotification.setApplicationIconBadgeNumber(badgeCount + 1);
        });

        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      requestPermissions: Platform.OS === 'ios',
    });

    // Request permission untuk iOS
    messaging().requestPermission()
      .then(authStatus => {
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      });

    // Tangani pesan saat aplikasi di foreground
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || 'You have a new notification!',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );

      // Perbarui badge count
      PushNotification.getApplicationIconBadgeNumber((badgeCount) => {
        PushNotification.setApplicationIconBadgeNumber(badgeCount + 1);
      });
    });

    // Tangani pesan saat aplikasi di background
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('A new FCM message arrived in the background!', remoteMessage);

      // Perbarui badge count
      PushNotification.getApplicationIconBadgeNumber((badgeCount) => {
        PushNotification.setApplicationIconBadgeNumber(badgeCount + 1);
      });
    });

    return () => {
      unsubscribeOnMessage();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SplashScreen1"
          component={SplashScreen1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Total Kupon"
          component={Totalkupon}
          options={{ title: 'Total Kupon' }}
        />
        <Stack.Screen
          name="Notifikasi"
          component={Notifikasi}
          options={{ title: 'Notifikasi' }}
        />
        <Stack.Screen
          name="PetugasScreen"
          component={PetugasScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
