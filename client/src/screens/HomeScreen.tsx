import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Virtual Wardrobe</Text>
      <Text style={styles.subtitle}>Welcome back!</Text>

      {/* Temporary Navigation Buttons for Testing */}
      <View style={styles.buttonContainer}>
        <Button
          title="Open Camera"
          onPress={() => navigation.navigate("Camera" as never)}
        />
        <Button
          title="My Wardrobe"
          onPress={() => navigation.navigate("Closet" as never)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  buttonContainer: {
    gap: 10,
  },
});

export default HomeScreen;
