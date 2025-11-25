import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import colors from "../constants/colors";

const CATEGORIES = [
  { id: "1", name: "T-Shirt", count: 12, color: "#FFE5EC" },
  { id: "2", name: "Denim Jacket", count: 8, color: "#E0F7FA" },
  { id: "3", name: "Shoes", count: 5, color: "#FFF9C4" },
  { id: "4", name: "Hats", count: 2, color: "#E1BEE7" },
  { id: "5", name: "Pants", count: 4, color: "#E1BEE7" },
];

export default function CategoryScreen() {
  const navigation = useNavigation();

  const handleCategoryPress = (categoryName: string) => {
    // @ts-ignore
    navigation.navigate("CategoryItems", { categoryName });
  };

  return (
    <View className="flex-1 bg-neo-background pt-12 px-5">
      <View className="flex-row items-center mb-8">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 bg-white border-2 border-neo-dark rounded-full mr-4"
        >
          <ChevronLeft size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-3xl font-black text-neo-dark">Categories</Text>
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCategoryPress(item.name)}
            style={{ backgroundColor: item.color }}
            className="w-[48%] aspect-square border-2 border-neo-dark rounded-2xl mb-4 p-4 justify-between"
          >
            <View className="w-10 h-10 bg-white/50 rounded-full border border-neo-dark justify-center items-center">
              <Text className="font-bold">{item.name[0]}</Text>
            </View>
            <View>
              <Text className="text-xl font-black text-neo-dark">
                {item.name}
              </Text>
              <Text className="text-gray-600 font-bold text-xs">
                View items
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
