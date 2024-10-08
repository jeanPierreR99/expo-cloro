import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const PhotoInformation = ({ user }:any) => {
  return (
    <View style={styles.profileContainer}>
      <Image
        source={{
          uri: "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg",
        }} 
        style={styles.profileImage}
      />
      <Text style={styles.name}>
        {user.firstName} {user.lastName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default PhotoInformation;