import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Settings, Award, Heart, Star } from "lucide-react-native";
import { NeoView, BlobCharacter } from "@/src/components/Navigation";
import colors from "../constants/colors";

export default function ProfileScreen() {
  return (
    <ScrollView
      className="flex-1 bg-neo-background p-5"
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Header */}
      <View className="flex-row justify-end mb-4 mt-2">
        <TouchableOpacity className="p-2 border-2 border-neo-dark rounded-full bg-neo-card">
          <Settings size={24} color={colors.dark} />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <NeoView
        color="bg-neo-pastelPink"
        style="mb-8"
        innerStyle="items-center py-8"
      >
        <View className="w-32 h-32 mb-4">
          <BlobCharacter mood="happy" color={colors.secondary} />
        </View>
        <Text className="text-2xl font-black text-neo-dark">Jocelyn Dias</Text>
        <Text className="font-bold opacity-60 text-neo-dark">
          Style Explorer
        </Text>

        <View className="flex-row gap-4 mt-6">
          <View className="items-center">
            <Text className="text-2xl font-black text-neo-dark">42</Text>
            <Text className="text-xs font-bold uppercase tracking-widest">
              Items
            </Text>
          </View>
          <View className="w-[2px] h-10 bg-neo-dark opacity-20" />
          <View className="items-center">
            <Text className="text-2xl font-black text-neo-dark">12</Text>
            <Text className="text-xs font-bold uppercase tracking-widest">
              Outfits
            </Text>
          </View>
        </View>
      </NeoView>

      {/* Stats Grid */}
      <Text className="text-xl font-black text-neo-dark mb-4">My Stats</Text>
      <View className="flex-row flex-wrap justify-between">
        <NeoView
          color="bg-neo-card"
          style="w-[48%] mb-4"
          innerStyle="items-start h-32 justify-between"
        >
          <Award size={32} color={colors.primary} />
          <View>
            <Text className="text-3xl font-black text-neo-dark">85%</Text>
            <Text className="font-bold text-xs text-gray-500">Style Score</Text>
          </View>
        </NeoView>
        <NeoView
          color="bg-neo-card"
          style="w-[48%] mb-4"
          innerStyle="items-start h-32 justify-between"
        >
          <Star size={32} color={colors.secondary} fill={colors.secondary} />
          <View>
            <Text className="text-3xl font-black text-neo-dark">5</Text>
            <Text className="font-bold text-xs text-gray-500">Day Streak</Text>
          </View>
        </NeoView>
      </View>

      {/* Menu List */}
      <View className="gap-3 mt-4">
        {["My Favorites", "Style Quiz", "Settings"].map((item, index) => (
          <TouchableOpacity
            key={index}
            className="bg-neo-card border-2 border-neo-dark p-4 rounded-xl flex-row justify-between items-center active:bg-gray-50"
          >
            <Text className="font-bold text-lg text-neo-dark">{item}</Text>
            <Text className="font-black text-xl text-neo-dark">{">"}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
