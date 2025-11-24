import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Shirt } from "lucide-react-native";
import { NeoView, NeoButton, BlobCharacter } from "@/src/components/Navigation";
import colors from "../constants/colors";

export default function PlannerScreen() {
  const days = [
    { d: "Mon", date: "12", active: false },
    { d: "Tue", date: "13", active: true },
    { d: "Wed", date: "14", active: false },
    { d: "Thu", date: "15", active: false },
    { d: "Fri", date: "16", active: false },
  ];

  return (
    <ScrollView
      className="flex-1 bg-neo-background p-5"
      contentContainerStyle={{ paddingBottom: 150 }}
    >
      <View className="flex-row justify-between items-center mb-6 mt-2">
        <Text className="text-3xl font-black text-neo-dark">Planner</Text>
        <NeoButton variant="black" style="h-10 px-4">
          This Week
        </NeoButton>
      </View>

      {/* Calendar Strip */}
      <View className="flex-row gap-2 mb-6">
        {days.map((day, idx) => (
          <View
            key={idx}
            className={`flex-1 py-3 rounded-xl border-2 border-neo-dark justify-center items-center ${
              day.active ? "bg-neo-primary" : "bg-neo-card"
            }`}
          >
            <Text
              className={`text-xs font-bold uppercase ${
                day.active ? "text-neo-light" : "text-neo-dark"
              }`}
            >
              {day.d}
            </Text>
            <Text
              className={`text-lg font-black ${
                day.active ? "text-neo-light" : "text-neo-dark"
              }`}
            >
              {day.date}
            </Text>
          </View>
        ))}
      </View>

      {/* Main Plan Card */}
      <NeoView
        color="bg-neo-pastelGreen"
        style="min-h-[300px]"
        innerStyle="p-4 relative"
      >
        <View className="absolute -top-3 -right-3 bg-neo-secondary border-2 border-neo-dark px-3 py-1 rounded-lg z-10 rotate-12">
          <Text className="font-extrabold text-xs text-neo-dark">
            Date Night!
          </Text>
        </View>

        <Text className="text-xl font-black text-neo-dark mb-4">
          Tuesday Look
        </Text>

        <View className="gap-3">
          <View className="flex-row items-center bg-neo-card border-2 border-neo-dark p-2 rounded-xl gap-3">
            <View className="w-10 h-10 bg-neo-pastelPink rounded-lg border-2 border-neo-dark justify-center items-center">
              <Shirt size={20} color={colors.dark} />
            </View>
            <Text className="font-extrabold text-neo-dark">
              Silk Button Down
            </Text>
          </View>
          <View className="flex-row items-center bg-neo-card border-2 border-neo-dark p-2 rounded-xl gap-3">
            <View className="w-10 h-10 bg-neo-pastelBlue rounded-lg border-2 border-neo-dark justify-center items-center">
              <Text>👖</Text>
            </View>
            <Text className="font-extrabold text-neo-dark">Wide Leg Jeans</Text>
          </View>
          <View className="flex-row items-center bg-neo-card border-2 border-neo-dark p-2 rounded-xl gap-3">
            <View className="w-10 h-10 bg-red-200 rounded-lg border-2 border-neo-dark justify-center items-center">
              <Text>🧣</Text>
            </View>
            <Text className="font-extrabold text-neo-dark">Red Scarf</Text>
          </View>
        </View>

        <NeoButton variant="outline" style="mt-6">
          Shuffle Outfit
        </NeoButton>
      </NeoView>

      {/* Tip Box */}
      <View className="mt-6 bg-neo-pastelOrange border-2 border-neo-dark p-4 rounded-2xl flex-row items-center gap-4">
        <View className="w-12 h-12">
          <BlobCharacter mood="cool" color="#fff" />
        </View>
        <Text className="flex-1 font-bold text-sm text-neo-dark">
          "Don't forget an umbrella later! It might rain around 4PM."
        </Text>
      </View>
    </ScrollView>
  );
}
