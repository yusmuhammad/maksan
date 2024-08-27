import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Totalkupon = ({ user }) => {
  const [totalKupon, setTotalKupon] = useState(null);
  const [historyPengambilan, setHistoryPengambilan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = 'https://yusril.sikapngalah.com';

  useEffect(() => {
    const fetchData = () => {
      fetch(`${API_BASE_URL}/api/kupon.php?id=${user.id}`)
        .then(response => response.json())
        .then(data => {
          setTotalKupon(data.total_kupon);
          setHistoryPengambilan(data.history_pengambilan);
          setLoading(false); // Set loading to false after data is fetched
        })
        .catch(error => {
          setError(error);
          setLoading(false); // Set loading to false in case of error
        });
    };

    fetchData(); // Initial fetch

    const interval = setInterval(fetchData, 3000); // Fetch data every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [user]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#00CED1', '#00CED1']} style={styles.card}>
        <Text style={styles.cardTitle}>Total Kupon Tersedia</Text>
        <Text style={styles.cardText}>{totalKupon}</Text>
      </LinearGradient>
      <SectionList
        sections={[
          { title: 'Riwayat Pengambilan Kupon Makan', data: historyPengambilan }
        ]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.hari} - {item.tanggal}</Text>
            <Text style={styles.itemText}>Jam 1: {item.jam_1} - Jam 2: {item.jam_2}</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={styles.historyContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'stretch',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    color: '#fff', // White text for contrast with gradient
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // White text for contrast with gradient
    alignSelf: 'center',
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black'
  },
  historyContainer: {
    flexGrow: 1,
    width: '100%',
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff', // Set a plain background color
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#000', // Black text color
  },
});

export default Totalkupon;
