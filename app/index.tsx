import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import appFirebase from "../js/credentialFirebase";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import { showMessage } from "@/js/functions";
const logo = require("../assets/images/logo-drvcs.png");
const db = getFirestore(appFirebase);

export default function login() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!user || !password) {
      setError("rellene todo los campos");
      return;
    }

    setLoading(true);
    getUser(user, password);
  };

  const getUserInformationAll = async (centroId: string) => {
    const userQuery = query(
      collection(db, "centros_poblados"),
      where("centro_id", "==", centroId)
    );

    const querySnapshot = await getDocs(userQuery);

    let docUserCentro: any = {};
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      docUserCentro = { ...docData };
    });
    return docUserCentro;
  };

  const getUser = async (user: any, password: any) => {
    const userQuery = query(
      collection(db, "gestores"),
      where("gestor_user", "==", user),
      where("gestor_password", "==", password),
      where("gestor_status", "==", true)
    );
    try {
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        showMessage(
          "info",
          "Usuario no encontrado",
          "No se encontro el usuario en la base de datos"
        );
        setError("Credenciales incorrectas");
        setLoading(false);
        return null;
      }

      let docUser: any = {};
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        docUser = { ...docData };
      });
      const centroInformation = await getUserInformationAll(
        docUser.id_centro_poblado
      );
      const gestorInfo: any = {
        gestor: docUser,
        centro_poblado: centroInformation,
      };
      saveUserToStorage(gestorInfo);
      setLoading(false);
      setError("");
    } catch (error) {
      showMessage(
        "error",
        "Error al subir a la nube",
        `Ocurrio un error inesperado.`
      );
      console.error("Error obteniendo documentos: ", error);
      setLoading(false);
      setError("");
      return null;
    }
  };

  const saveUserToStorage = async (userStorage: any) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userStorage)); // Convertimos el objeto a string
      router.replace("/home");
      console.log("Usuario guardado en AsyncStorage");
    } catch (e) {
      console.error("Error al guardar el usuario:", e);
    }
  };

  const loadUserFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser !== null) {
        router.replace("/home");
      }
    } catch (e) {
      console.error("Error al cargar el usuario:", e);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <View style={styles.container}>
        <Image source={logo} style={styles.logoImage} />
        <Text style={styles.subtitle} className="text-red-500 font-bold">
          Ingrese con una cuenta válida
        </Text>

        <TextInput
          className="border border-gray-300 focus:border-red-500"
          style={styles.input}
          placeholder="Ingrese su Usuario"
          placeholderTextColor="#888"
          keyboardType="default"
          value={user}
          onChangeText={setUser}
        />
        <TextInput
          className="border border-gray-300 focus:border-red-500"
          style={styles.input}
          placeholder="Ingrese su Contraseña"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity
          style={styles.button}
          className="bg-red-500"
          onPress={handleLogin}
          disabled={loading} // Deshabilita el botón si se está cargando
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Ingresar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotText}>Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logoImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
    marginBottom: 10,
  },
  title: {
    color: "#000",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: "100%",

    padding: 8,
    borderRadius: 20,
    color: "#000",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 13,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotText: {
    color: "#007aff",
    fontSize: 14,
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
});
