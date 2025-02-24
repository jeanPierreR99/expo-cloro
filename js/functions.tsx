import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

export interface gestor {
  gestor_id: string;
  gestor_dni: string;
  gestor_name_complete: string;
  gestor_phone: string;
  gestor_user: string;
  gestor_password: string;
  gestor_image: string;
}
export interface centro_poblado {
  centro_id: string;
  centro_nombre: string;
  centro_provincia: string;
  centro_distrito: string;
  centro_latitud: string;
  centro_longitud: string;
  centro_enMeta: boolean;
}

export interface InformationAll {
  gestor: gestor;
  centro_poblado: centro_poblado;
}

export const loadUserFromStorage = async () => {
  try {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser !== null) {
      const user = JSON.parse(storedUser);
      return user;
    }
  } catch (e) {
    console.error("Error al cargar el usuario:", e);
  }
};

export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem("user");
    console.log("Usuario eliminado de AsyncStorage");
    router.replace("/");
  } catch (error) {
    console.error("Error eliminando el usuario de AsyncStorage", error);
  }
};
export const showMessage = (
  type: string,
  messageOne: string,
  messageTwo: string
) => {
  Toast.show({
    type: type,
    text1: messageOne,
    text2: messageTwo,
    visibilityTime: 5000,
    position: "top",
    text1Style: { fontSize: 16, fontWeight: "bold" },
    text2Style: { fontSize: 14, color: "gray" },
  });
};
