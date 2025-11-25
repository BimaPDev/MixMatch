import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
// Make sure this path matches where your colors file is
import colors from "../constants/colors";

const CategoryItemsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Get params passed from the Category screen (e.g., "Shirts", "Pants")
  // Default to 'Items' if undefined to prevent crashes
  const { categoryName } = (route.params as { categoryName: string }) || {
    categoryName: "Category Items",
  };

  // Placeholder data - You will eventually fetch this from your Go backend
  const dummyItems = [
    { id: "1", name: "Blue Shirt", color: "Blue" },
    { id: "2", name: "Red T-Shirt", color: "Red" },
    { id: "3", name: "Denim Jacket", color: "Blue" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{categoryName}</Text>
      </View>

      <FlatList
        data={dummyItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.placeholderImage} />
            <View style={styles.textContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemSub}>{item.color}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Or colors.background if defined
  },
  header: {
    padding: 20,
    paddingTop: 60, // Space for status bar
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    // Neumorphic-style shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  itemSub: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default CategoryItemsScreen;
