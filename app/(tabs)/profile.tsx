import { ScrollView, StyleSheet, View } from "react-native";
import UserInformation from "../../components/UserInformation:";
import Header from "@/components/Header";

export default function Profile() {
  return (
    <View className="flex-1 bg-white">
      <Header></Header>
      <ScrollView>
        <View style={styles.container}>
          <UserInformation></UserInformation>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
});
