import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import {
  Search,
  Filter,
  Plus,
  Shirt,
  X,
  Heart,
  MoreHorizontal,
} from "lucide-react-native";
import { NeoView, NeoButton } from "@/src/components/Navigation";
import colors from "../constants/colors";

interface Item {
  id: number;
  name: string;
  cat: string;
  color: string;
  icon: React.ReactNode;
}

const ItemDetailModal = ({
  item,
  visible,
  onClose,
}: {
  item: Item | null;
  visible: boolean;
  onClose: () => void;
}) => {
  if (!item) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-neo-card border-t-2 border-neo-dark rounded-t-3xl h-[85%] p-6">
          <TouchableOpacity
            onPress={onClose}
            className="self-end p-2 bg-gray-100 rounded-full border-2 border-neo-dark mb-4"
          >
            <X size={20} color={colors.dark} />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <NeoView
              color={item.color}
              style="w-full aspect-square mb-6"
              innerStyle="justify-center items-center"
            >
              <View className="transform scale-[2]">{item.icon}</View>
            </NeoView>

            <View className="flex-row justify-between items-start mb-2">
              <View>
                <View className="bg-neo-dark px-2 py-1 rounded mb-2 self-start">
                  <Text className="text-neo-light font-extrabold text-xs uppercase">
                    {item.cat}
                  </Text>
                </View>
                <Text className="text-3xl font-black text-neo-dark">
                  {item.name}
                </Text>
              </View>
              <TouchableOpacity className="p-3 border-2 border-neo-dark rounded-xl bg-neo-card">
                <Heart size={24} color={colors.dark} />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-500 font-semibold mb-6">
              Added on Oct 24 • Worn 12 times
            </Text>

            <Text className="text-lg font-black text-neo-dark mb-3">
              Matches well with
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-6 px-6 mb-6"
            >
              {[1, 2, 3].map((i) => (
                <View
                  key={i}
                  className="w-24 h-32 bg-gray-50 border-2 border-neo-dark rounded-xl mr-3 justify-center items-center"
                >
                  <Text className="text-4xl font-black opacity-20">?</Text>
                </View>
              ))}
            </ScrollView>

            <View className="flex-row gap-4">
              <NeoButton variant="primary" style="flex-1">
                Add to Plan
              </NeoButton>
              <NeoButton variant="outline" style="w-20" icon={MoreHorizontal} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default function ClosetScreen() {
  const [activeCat, setActiveCat] = useState("All");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const categories = ["All", "Tops", "Bottoms", "Shoes", "Acc."];

  const items: Item[] = [
    {
      id: 1,
      name: "Graphic Tee",
      cat: "Tops",
      color: "bg-neo-pastelPink",
      icon: <Shirt size={50} color={colors.dark} />,
    },
    {
      id: 2,
      name: "Cargo Pants",
      cat: "Bottoms",
      color: "bg-neo-pastelGreen",
      icon: <Text className="text-5xl">👖</Text>,
    },
    {
      id: 3,
      name: "Chunky Sneakers",
      cat: "Shoes",
      color: "bg-neo-pastelBlue",
      icon: <Text className="text-5xl">👟</Text>,
    },
    {
      id: 4,
      name: "Bucket Hat",
      cat: "Acc.",
      color: "bg-neo-pastelYellow",
      icon: <Text className="text-5xl">🧢</Text>,
    },
    {
      id: 5,
      name: "Denim Jacket",
      cat: "Tops",
      color: "bg-indigo-200",
      icon: <Shirt size={50} color="indigo" />,
    },
    {
      id: 6,
      name: "Tote Bag",
      cat: "Acc.",
      color: "bg-red-200",
      icon: <Text className="text-5xl">👜</Text>,
    },
  ];

  const filtered =
    activeCat === "All" ? items : items.filter((i) => i.cat === activeCat);

  return (
    <View className="flex-1 bg-neo-background p-5">
      <View className="flex-row justify-between items-center mb-6 mt-2">
        <Text className="text-3xl font-black text-neo-dark">My Closet</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity className="p-2 border-2 border-neo-dark rounded-lg bg-neo-card">
            <Search size={20} color={colors.dark} />
          </TouchableOpacity>
          <TouchableOpacity className="p-2 border-2 border-neo-dark rounded-lg bg-neo-card">
            <Filter size={20} color={colors.dark} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="h-14 mb-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCat(cat)}
              className={`px-5 py-2.5 rounded-full border-2 border-neo-dark ${
                activeCat === cat ? "bg-neo-dark" : "bg-neo-card"
              }`}
            >
              <Text
                className={`font-extrabold ${
                  activeCat === cat ? "text-neo-light" : "text-neo-dark"
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="flex-row flex-wrap justify-between">
          {filtered.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="w-[48%] mb-5"
              onPress={() => setSelectedItem(item)}
              activeOpacity={0.8}
            >
              <NeoView
                color={item.color}
                style="w-full"
                innerStyle="aspect-[4/5] p-2 justify-between"
              >
                <View className="flex-1 justify-center items-center">
                  {item.icon}
                </View>
                <View className="bg-neo-card border-2 border-neo-dark rounded-lg py-1 px-2 items-center">
                  <Text className="font-bold text-xs" numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              </NeoView>
            </TouchableOpacity>
          ))}

          <TouchableOpacity className="w-[48%] mb-5 aspect-[4/5] border-4 border-dashed border-gray-400 rounded-2xl justify-center items-center">
            <Plus size={32} color="#9CA3AF" strokeWidth={3} />
            <Text className="text-gray-400 font-extrabold mt-2">Add New</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ItemDetailModal
        item={selectedItem}
        visible={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </View>
  );
}
