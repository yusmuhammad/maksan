import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';
import { Icon } from 'react-native-elements'; // Import Icon from react-native-elements
import LinearGradient from 'react-native-linear-gradient';

import Totalkupon from './Totalkupon';
import Notifikasi from './Notifikasi';
const API_BASE_URL = 'https://yusril.sikapngalah.com';
const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const route = useRoute();
  const { user } = route.params;

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#00CED1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#00CED1',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name={focused ? 'home' : 'home-outline'} type='ionicon' size={size} color={color} />
          ),
        }}
      >
        {props => <HomeContent {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen
        name="Kupon Makan"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name={focused ? 'pricetag' : 'pricetag-outline'} type='ionicon' size={size} color={color} />
          ),
        }}
      >
        {props => <Totalkupon {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen
        name="Notifikasi"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon name={focused ? 'notifications' : 'notifications-outline'} type='ionicon' size={size} color={color} />
          ),
        }}
      >
        {props => <Notifikasi {...props} user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const HomeContent = ({ user }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentYear = new Date().getFullYear();

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/home.php?id=${user.id}`);
      const data = await response.json();
      setData(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  const handlePay = async (id) => {
    const urlpay = `${API_BASE_URL}/midtrans/Payment/snap-redirect/checkout-process.php?santri_id=${id.santri_id}&tagihan_id=${id.id}`;
    console.log(urlpay);
    Linking.openURL(urlpay);
  };
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Fetch API every 5 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [user]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#f3f4f6', '#e1e5ea']} style={styles.container}>
      <View style={styles.dataSantriContainer}>
        <Text style={styles.sectionTitle}>Data Santri</Text>
        <LinearGradient colors={['#00CED1', '#00CED1']} style={styles.card}>
          <Text style={styles.cardText}>Nama: {data.data_santri.nama}</Text>
          <Text style={styles.cardText}>Asrama: {data.data_santri.asrama}</Text>
          <Text style={styles.cardText}>No HP: {data.data_santri.no_hp}</Text>
          <Text style={styles.cardText}>Wali Santri: {data.data_santri.wali_santri}</Text>
        </LinearGradient>
      </View>
      <Text style={styles.sectionTitle}>Daftar Tagihan {currentYear}</Text>
      <View style={styles.tableRow}>
          <Text style={[styles.tableHeader, styles.tableCell]}>Bulan</Text>
          <Text style={[styles.tableHeader, styles.tableCell]}>Jumlah</Text>
          <Text style={[styles.tableHeader, styles.tableCell]}>Status</Text>
        </View>
      <ScrollView style={styles.daftarTagihanContainer}>
        
        
        {data.daftar_tagihan.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.bulan}</Text>
            <Text style={styles.tableCell}>
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.jumlah)}
            </Text>
            <View style={styles.radioButtonContainer}>
              <RadioButton selected={item.status === 'Lunas'} onPress={() => handlePay(item)} />
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const RadioButton = ({ selected, onPress }) => (
  <TouchableOpacity
    style={[styles.radioButton, selected ? styles.radioButtonSelected : styles.radioButtonNotSelected]}
    onPress={onPress}
    disabled={selected}
  >
    <Text style={styles.buttonText}>{selected ? 'Lunas' : 'Bayar'}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  dataSantriContainer: {
    marginBottom: 16,
  },
  daftarTagihanContainer: {
    flex: 1,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  radioButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#00BFFF',
  },
  radioButtonNotSelected: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#000',
  },
  tableHeader: {
    backgroundColor: '#f1f1f1',
    fontWeight: 'bold',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  radioButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
