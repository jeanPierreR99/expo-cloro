import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import {
  InformationAll,
  loadUserFromStorage,
  removeUserData,
} from "@/js/functions";

export default function Header() {
  const [date, setDate] = useState("");
  const [user, setUser] = useState<InformationAll | null>(null);

  const loadUserStorage = async () => {
    const userStorage = await loadUserFromStorage();
    if (userStorage) {
      setUser(userStorage);
    }
  };

  function getDate() {
    const now = new Date();
    const localDate = now.toLocaleDateString();
    setDate(localDate);
  }

  useEffect(() => {
    getDate();
    loadUserStorage();
  }, []);
  return (
    <View className="bg-red-600 p-4 h-50 rounded-b-3xl relative">
      <TouchableOpacity
        onPress={removeUserData}
        className="w-10 items-center absolute top-4 right-4"
      >
        <Icon name="log-out-outline" size={27} color="white" />
      </TouchableOpacity>
      <Image
        source={{
          uri: user?.gestor.gestor_image,
        }}
        className="w-[100px] h-[100px] rounded-full"
      />
      <Text className="text-white text-xl font-bold">
        {user?.gestor.gestor_name_complete}
      </Text>
      <Text className="text-gray-200">
        Gestor del C.P {user?.centro_poblado.centro_nombre}
      </Text>
      <Text className="text-gray-200 text-right">{date}</Text>
    </View>
  );
}
