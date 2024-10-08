import { InformationAll, loadUserFromStorage } from "@/js/functions";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
} from "react-native";

const UserInformation = () => {
  const [user, setUser] = useState<InformationAll | null>(null);

  const loadUserStorage = async () => {
    const userStorage = await loadUserFromStorage();
    if (userStorage) {
      setUser(userStorage);
    }
  };

  useEffect(() => {
    loadUserStorage();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.sectionTitle}>Información</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>DNI:</Text>
        <Text style={styles.value}>{user?.gestor.gestor_dni}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Telefono:</Text>
        <Text style={styles.value}>{user?.gestor.gestor_phone}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Centro Poblado:</Text>
        <Text style={styles.value}>{user?.centro_poblado.centro_nombre}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Provincia:</Text>
        <Text style={styles.value}>
          {user?.centro_poblado.centro_provincia}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Distrito:</Text>
        <Text style={styles.value}>{user?.centro_poblado.centro_distrito}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Latitud:</Text>
        <Text style={styles.value}>{user?.centro_poblado.centro_latitud}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Longitud:</Text>
        <Text style={styles.value}>{user?.centro_poblado.centro_longitud}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>MetaFed:</Text>
        <Text style={styles.value}>
          {" "}
          {user?.centro_poblado.centro_enMeta ? "si" : "no"}
        </Text>
      </View>

      <View>
        <TouchableOpacity
          style={styles.button}
          className="bg-red-500"
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Editar información</Text>
        </TouchableOpacity>
      </View>
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
            <Text style={styles.modalText}>Editar Información</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
            />
            <TouchableOpacity
              className="absolute top-2 right-4"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-gray-400 text-lg">X</Text>
            </TouchableOpacity>
            <View>
              <TouchableOpacity
                style={styles.button}
                className="bg-red-500"
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  infoContainer: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#007aff",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontWeight: "600",
    color: "#333",
  },
  red: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
  },
  value: {
    fontWeight: "400",
    color: "#555",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.4)",
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
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "600",
  },
  modalInput: {
    width: "100%",
    borderWidth: 0.5,
    padding: 5,
    borderRadius: 10,
    color: "#000",
    fontSize: 16,
    marginBottom: 8,
  },
 
});

export default UserInformation;
