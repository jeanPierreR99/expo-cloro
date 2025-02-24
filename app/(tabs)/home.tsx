import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Image
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import Ionicons from "@expo/vector-icons/Ionicons";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import appFirebase from "../../js/credentialFirebase";
import Header from "@/components/Header";
import {
  InformationAll,
  loadUserFromStorage,
  showMessage,
} from "@/js/functions";
import { getDatabase, ref, onValue, Unsubscribe } from "firebase/database";
import { ref as refStorage, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import ModalCamera from "@/components/ModalCamera";

const storage = getStorage(appFirebase);
const db = getFirestore(appFirebase);
const dbRealTime = getDatabase(appFirebase);

interface monitorCloroImages {
  monitor_cloro_image_url: string;
}

interface monitorCloro {
  monitor_cloro_id: string;
  monitor_cloro_value: number;
  monitor_cloro_populate_center_id: string;
  monitor_cloro_gestor_id: string;
  monitor_cloro_date: string;
  monitor_cloro_punto: string;
  monitor_cloro_tipo: string;
  monitor_cloro_observaciones: string;
  monitor_cloro_images: monitorCloroImages[];
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
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [photo, setPhoto] = useState<any[]>([]);

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
      const cloroRef = ref(dbRealTime, `monitor_auxiliar/${centroId}`);

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

      let urlImages: any = await Promise.all(
        photo.map(async (data) => {
          const url = await uploadFile(data.uri);
          return { monitor_cloro_image_url: url };
        })
      );

      const valMonitorCloro: monitorCloro = {
        monitor_cloro_id: monitor_cloro_id,
        monitor_cloro_value: cloro,
        monitor_cloro_populate_center_id: userStorage.centro_poblado.centro_id,
        monitor_cloro_gestor_id: userStorage.gestor.gestor_id,
        monitor_cloro_date: date,
        monitor_cloro_punto: selectedPunto,
        monitor_cloro_tipo: selectedMonitoreo,
        monitor_cloro_observaciones: observaciones,
        monitor_cloro_images: urlImages,
      };

      await setDoc(docRef, valMonitorCloro);
      showMessage(
        "success",
        "Subido correctamente a la nube",
        `${cloro}%CL Subido. 🎉`
      );
      setLoading(false);
      setPhoto([]);
    } catch (e) {
      console.error("Error al cargar el usuario:", e);
      showMessage(
        "error",
        "Error al subir a la nube",
        `Ocurrio un error inesperado.`
      );
    }
  };

  const uploadFile = async (uri: string) => {
    try {
      const blob = await uriToBlob(uri);
      const fileRef = refStorage(storage, `obs/${Date.now()}.jpg`);
      await uploadBytes(fileRef, blob);
      const downloadUrl = await getDownloadURL(fileRef);
      return downloadUrl;
    } catch (error) {
      console.error("Error al subir imagen:", error);
    }
  };

  const uriToBlob = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  useEffect(() => {
    getDate();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <Header />

      <ScrollView>
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

          <View className="w-full flex-row items-center">
            <TextInput
              className="border p-3 flex-1 text-[16px] border-gray-300 focus:border-red-500 rounded-3xl"
              onChangeText={(text) => setObservaciones(text)}
              placeholder="Observaciones"
              placeholderTextColor="#888"
            />
            <TouchableOpacity className="ml-2 p-2 rounded-full bg-gray-100"
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="camera-outline" size={36} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ModalCamera modalVisible={modalVisible} setModalVisible={setModalVisible} photo={photo} setPhoto={setPhoto}></ModalCamera>
          <ScrollView horizontal className='flex-row'>
            {photo.map((data: any, index: any) => (
              <View key={index} className='w-[70px] h-[70px] relative'>
                <TouchableOpacity className='absolute top-0 right-0' style={{ zIndex: 999 }} onPress={() => setPhoto((prev: any) => prev.filter((_: any, i: any) => i !== index))}>
                  <Text className='text-red-500 text-lg font-bold'>X</Text>
                </TouchableOpacity>
                <Image source={{ uri: "data:image/jpg;base64," + data.base64 }} style={{ width: '100%', height: '100%' }} />
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.button}
            className="bg-blue-500"
            onPress={HandleSocket}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {isListening ? "Activar" : "Detener"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            className="bg-gray-300"
            onPress={() => { setCloro(0) }}
          >
            <Text style={styles.buttonText}>
              Restablecer
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
      </ScrollView>
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
});
