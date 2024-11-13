import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";

import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import appFirebase from "../../js/credentialFirebase";
import Header from "@/components/Header";
import {
  InformationAll,
  loadUserFromStorage,
  showMessage,
} from "@/js/functions";
import { getDatabase, ref, onValue, Unsubscribe } from "firebase/database"; // Asegúrate de que estás usando Realtime Database

const db = getFirestore(appFirebase);
const dbRealTime = getDatabase(appFirebase);

interface monitorCloro {
  monitor_cloro_id: string;
  monitor_cloro_value: number;
  monitor_cloro_populate_center_id: string;
  monitor_cloro_gestor_id: string;
  monitor_cloro_date: string;
  monitor_cloro_punto: string;
  monitor_cloro_tipo: string;
  monitor_cloro_observaciones: string;
}

export default function home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMonitoreo, setSelectedMonitoreo] =
    useState<string>("Primer Monitoreo");
  const [selectedPunto, setSelectedPunto] = useState<string>("Reservorio");
  const [cloro, setCloro] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [observaciones, setObservaciones] = useState<string>("s/o");
  const [isListening, setIsListening] = useState<boolean>(true);
  const [unsubscribe, setUnsubscribe] = useState<Unsubscribe | null>(null);

  function getDate() {
    const now = new Date();
    const localDate = now.toLocaleDateString();
    setDate(localDate);
  }

  const HandleSocket = async () => {
    setIsListening(!isListening);
    const user = await loadUserFromStorage();

    if (user) {
      const centroId = user.centro_poblado.centro_id;
      const cloroRef = ref(dbRealTime, `monitor_auxiliar/${centroId}`); // Referencia a tu nodo específico

      if (isListening) {
        const listener = onValue(cloroRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setCloro(data.val_cloro);
          }
        });

        setUnsubscribe(() => listener);
      } else {
        if (unsubscribe) {
          unsubscribe();
          setUnsubscribe(null);
        }
      }
    }
  };

  const sendCloud = async () => {
    try {
      const userStorage: InformationAll = await loadUserFromStorage();

      setLoading(true);
      const docRef = doc(collection(db, "monitor_cloro"));
      const monitor_cloro_id = docRef.id;

      const valMonitorCloro: monitorCloro = {
        monitor_cloro_id: monitor_cloro_id,
        monitor_cloro_value: cloro,
        monitor_cloro_populate_center_id: userStorage.centro_poblado.centro_id,
        monitor_cloro_gestor_id: userStorage.gestor.gestor_id,
        monitor_cloro_date: date,
        monitor_cloro_punto: selectedPunto,
        monitor_cloro_tipo: selectedMonitoreo,
        monitor_cloro_observaciones: observaciones,
      };

      await setDoc(docRef, valMonitorCloro);
      showMessage(
        "success",
        "Subido correctamente a la nube",
        `${cloro}%CL Subido. 🎉`
      );
      setLoading(false);
    } catch (e) {
      console.error("Error al cargar el usuario:", e);
      showMessage(
        "error",
        "Error al subir a la nube",
        `Ocurrio un error inesperado.`
      );
    }
  };

  useEffect(() => {
    // let unsubscribe: () => void = () => {};

    // const fetchMonitorAuxiliar = async () => {
    // const result = await getDatAuxiliar();
    //   if (result) {
    //     unsubscribe = result;
    //   }
    // };

    // fetchMonitorAuxiliar();
    getDate();
    // return () => {
    // unsubscribe();
    // };
  }, []);

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View style={styles.container}>
        <Picker
          selectedValue={selectedPunto}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => setSelectedPunto(itemValue)}
        >
          <Picker.Item label="Reservorio" value="Reservorio" />
          <Picker.Item label="Primera Vivienda" value="Primera Vivienda" />
          <Picker.Item
            label="Vivienda Intermedia"
            value="Vivienda Intermedia"
          />
          <Picker.Item label="Ultima Vivienda" value="Ultima Vivienda" />
        </Picker>
        <Picker
          selectedValue={selectedMonitoreo}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedMonitoreo(itemValue)
          }
        >
          <Picker.Item label="Primer Monitoreo" value="Primer Monitoreo" />
          <Picker.Item label="Segundo Monitoreo" value="Segundo Monitoreo" />
          <Picker.Item label="Tercer Monitoreo" value="Tercer Monitoreo" />
        </Picker>

        <Text className="text-6xl text-gray-400 mt-10">{cloro} %Cl</Text>
        {!isListening && (
          <Text className="text-xs text-gray-400 my-2">
            Obteniendo datos...
          </Text>
        )}
        <TextInput
          className="border border-gray-300 focus:border-red-500"
          style={styles.modalInput}
          onChangeText={(text) => setObservaciones(text)}
          placeholder="Observaciones"
          placeholderTextColor="#888"
        />

        <TouchableOpacity
          style={styles.button}
          className="bg-gray-300"
          onPress={HandleSocket}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {isListening ? "Activar" : "Detener"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          className="bg-red-500"
          onPress={sendCloud}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Enviar a la nuve</Text>
          )}
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    padding: 20,
  },
  button: {
    paddingVertical: 13,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  picker: {
    width: "100%",
  },
  modalInput: {
    paddingLeft: 12,
    width: "100%",
    padding: 5,
    borderRadius: 20,
    fontSize: 16,
  },
});
