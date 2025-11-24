import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Sun, Shirt } from "lucide-react-native";
import { NeoView, NeoButton, BlobCharacter } from "@/src/components/Navigation";
import colors from "../constants/colors";

export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-neo-background p-5"
      contentContainerStyle={{ paddingBottom: 150 }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6 mt-2">
        <View>
          <Text className="text-3xl font-black text-neo-dark">Hello,</Text>
          <Text className="text-3xl font-black text-neo-primary">
            Fashionista! ✨
          </Text>
        </View>
        <View className="w-20 h-20">
          <BlobCharacter mood="excited" color={colors.secondary} />
        </View>
      </View>

      {/* Weather Widget */}
      <NeoView
        color="bg-neo-pastelBlue"
        style="mb-6"
        innerStyle="flex-row justify-between items-center"
      >
        <View>
          <View className="flex-row items-center gap-2">
            <Sun size={24} color={colors.dark} strokeWidth={2.5} />
            <Text className="text-lg font-extrabold text-neo-dark">
              Sunny, 24°C
            </Text>
          </View>
          <Text className="mt-1 text-sm font-semibold opacity-70 max-w-[200px] text-neo-dark">
            Perfect day for that vintage denim jacket!
          </Text>
        </View>
        <Text className="text-4xl">🌤️</Text>
      </NeoView>

      {/* Today's Look */}
      <View className="mb-6">
        <View className="flex-row justify-between items-end mb-3">
          <Text className="text-xl font-black tracking-widest text-neo-dark">
            TODAY'S LOOK
          </Text>
          <TouchableOpacity>
            <Text className="text-sm font-extrabold underline text-neo-dark">
              Edit
            </Text>
          </TouchableOpacity>
        </View>

        <NeoView
          color="bg-neo-pastelOrange"
          style="h-80 w-full"
          innerStyle="justify-center items-center overflow-hidden"
        >
          {/* Floating Tag */}
          <View className="absolute top-4 right-4 bg-neo-card px-3 py-1 rounded-full border-2 border-neo-dark z-10">
            <Text className="font-extrabold text-xs text-neo-dark">
              Casual Friday
            </Text>
          </View>

          <View className="w-full h-full flex-row flex-wrap gap-3 pt-8">
            <View className="flex-1 h-28 rounded-xl border-2 border-neo-dark bg-neo-card justify-center items-center">
              <Shirt size={48} color={colors.primary} strokeWidth={2} />
            </View>
            <View className="flex-1 h-28 rounded-xl border-2 border-neo-dark bg-neo-card justify-center items-center">
              <Text className="text-4xl">👖</Text>
            </View>
            <View className="w-full h-24 rounded-xl border-2 border-neo-dark bg-neo-card justify-center items-center">
              <Text className="text-4xl">👟</Text>
            </View>
          </View>
        </NeoView>
      </View>

      {/* Actions */}
      <View className="flex-row gap-4">
        <NeoButton variant="secondary" style="flex-1">
          Log Outfit
        </NeoButton>
        <NeoButton variant="outline" style="flex-1">
          Get Inspired
        </NeoButton>
      </View>
    </ScrollView>
  );
}
