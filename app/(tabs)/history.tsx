import Header from "@/components/Header";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from "react-native";
import appFirebase from "../../js/credentialFirebase";
import { Picker } from "@react-native-picker/picker";
import { loadUserFromStorage } from "@/js/functions";
import CharBart from "@/components/CharBart";
const db = getFirestore(appFirebase);

export interface HistoryItem {
  monitor_cloro_id: string;
  monitor_cloro_date: string;
  monitor_cloro_value: string;
  monitor_cloro_punto: string;
  monitor_cloro_tipo: string;
  monitor_cloro_observaciones: string;
}

export default function History() {
  const [monitorCloro, setMonitorCloro] = useState<HistoryItem[] | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [selectedMonitoreo, setSelectedMonitoreo] = useState("Todos");
  const [modalVisible, setModalVisible] = useState(false);

  const handleMonitorHistory = async () => {
    try {
      setError(false);
      const user = await loadUserFromStorage();
      if (user) {
        const userQuery = query(
          collection(db, "monitor_cloro"),
          where("monitor_cloro_gestor_id", "==", user?.gestor.gestor_id)
        );

        const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
          const docHistory: any[] = [];

          querySnapshot.forEach((doc) => {
            const docData = doc.data();
            docHistory.push({ ...docData });
          });
          setMonitorCloro(docHistory);
        });

        return unsubscribe;
      }

      return undefined;
    } catch (e) {
      setError(true);
      console.log(e);
    }
  };

  useEffect(() => {
    let unsubscribe: () => void = () => { };

    const fetchMonitorHistory = async () => {
      const result = await handleMonitorHistory();
      if (result) {
        unsubscribe = result;
      }
    };

    fetchMonitorHistory();

    return () => {
      unsubscribe();
    };
  }, []);

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <Text style={styles.label}>Fecha:</Text>
        <Text style={styles.value}>{item.monitor_cloro_date}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tipo:</Text>
        <Text style={styles.value}>{item.monitor_cloro_tipo}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Punto:</Text>
        <Text style={styles.value}>{item.monitor_cloro_punto}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Cloro residual:</Text>
        <Text style={styles.value}>{item.monitor_cloro_value}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Observaciones:</Text>
        <Text style={styles.value}>{item.monitor_cloro_observaciones}</Text>
      </View>
    </View>
  );
  const filteredData =
    selectedMonitoreo === "Todos"
      ? monitorCloro
      : monitorCloro?.filter(
        (item) => item.monitor_cloro_tipo === selectedMonitoreo
      );

  return (
    <View className="bg-white flex-1">
      <Header />
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer} className="relative">
          <View style={styles.modalContent}>
            <TouchableOpacity
              className="absolute top-2 right-4 z-10"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-gray-400 text-lg p-1 px-2">X</Text>
            </TouchableOpacity>

            <View className="mb-6">
              <Text className="font-bold mb-4">Primer Monitoreo</Text>
              <CharBart data={monitorCloro} text={"Primer Monitoreo"} />
            </View>
            <View className="mb-6">
              <Text className="font-bold mb-4">Segundo Monitoreo</Text>
              <CharBart data={monitorCloro} text={"Segundo Monitoreo"} />
            </View>
            <View>
              <Text className="font-bold mb-4">Tercer Monitoreo</Text>
              <CharBart data={monitorCloro} text={"Tercer Monitoreo"} />
            </View>
          </View>
        </View>
      </Modal>


      <Picker
        selectedValue={selectedMonitoreo}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedMonitoreo(itemValue)
        }
      >
        <Picker.Item label="Todos" value="Todos" />
        <Picker.Item label="Primer Monitoreo" value="Primer Monitoreo" />
        <Picker.Item label="Segundo Monitoreo" value="Segundo Monitoreo" />
        <Picker.Item label="Tercer Monitoreo" value="Tercer Monitoreo" />
      </Picker>
      {!error ? (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<ActivityIndicator size={24}></ActivityIndicator>}
        />
      ) : (
        <Text className="ml-4">Ocurrio un error</Text>
      )}

      {monitorCloro && (<View>
        <TouchableOpacity
          className="m-2 py-2"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-blue-500 text-center font-bold">Ver Gráfico</Text>
        </TouchableOpacity>
      </View>)}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 12,
  },
  itemContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.4)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
