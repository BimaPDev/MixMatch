import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }: any) {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-4xl font-bold mb-10 text-slate-800">MixMatch</Text>

      <TouchableOpacity
        className="bg-blue-600 px-8 py-4 rounded-full mb-4 w-64 items-center shadow-lg"
        onPress={() => navigation.navigate("Camera")}
      >
        <Text className="text-white font-bold text-lg">📸 Add New Item</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-slate-200 px-8 py-4 rounded-full w-64 items-center"
        onPress={() => navigation.navigate("Wardrobe")}
      >
        <Text className="text-slate-800 font-bold text-lg">👕 My Closet</Text>
      </TouchableOpacity>
    </View>
  );
}
