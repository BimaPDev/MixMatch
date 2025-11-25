import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import client from "../api/client";
import colors from "../constants/colors";
import { ArrowRight } from "lucide-react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

type WardrobeItem = {
  id: string;
  image_url: string;
  category: string;
  color: string;
};

export default function WardrobeScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWardrobe = async () => {
    try {
      const response = await client.get("/items");
      setItems(response.data || []);
    } catch (error) {
      console.log("Error fetching wardrobe:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchWardrobe);
    return unsubscribe;
  }, [navigation]);

  const getImageUrl = (path: string) => {
    const cleanPath = path.replace(/\\/g, "/");
    return `${client.defaults.baseURL}/${cleanPath}`;
  };

  const renderItem = ({ item }: { item: WardrobeItem }) => (
    <View
      style={{ width: CARD_WIDTH }}
      className="mr-4 bg-white rounded-3xl p-3 border-2 border-neo-dark shadow-sm"
    >
      <View className="flex-1 bg-gray-100 rounded-xl overflow-hidden border border-neo-dark mb-3">
        <Image
          source={{ uri: getImageUrl(item.image_url) }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View>
        <Text className="font-black text-neo-dark text-lg capitalize">
          {item.color} {item.category}
        </Text>
        <Text className="text-gray-500 font-bold text-xs">Just Added</Text>
      </View>
    </View>
  );

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-neo-background">
        <ActivityIndicator size="large" color={colors.dark} />
      </View>
    );

  return (
    <View className="flex-1 bg-neo-background pt-12 pl-5">
      <View className="flex-row justify-between items-end pr-5 mb-6">
        <View>
          <Text className="text-4xl font-black text-neo-dark">My</Text>
          <Text className="text-4xl font-black text-neo-primary">Wardrobe</Text>
        </View>
        <TouchableOpacity
          // @ts-ignore
          onPress={() => navigation.navigate("Category")}
          className="flex-row items-center bg-white px-3 py-2 rounded-full border-2 border-neo-dark"
        >
          <Text className="font-bold text-xs mr-1">View All</Text>
          <ArrowRight size={14} color="black" />
        </TouchableOpacity>
      </View>

      <View className="h-[65%]">
        <Text className="text-lg font-bold text-gray-500 mb-4">
          Recent Adds
        </Text>
        {items.length === 0 ? (
          <View className="flex-1 justify-center items-center pr-5">
            <Text className="text-gray-400 font-bold">Wardrobe empty!</Text>
            <Text className="text-gray-400 text-xs">
              Snap a photo to start.
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={{ paddingRight: 20 }}
          />
        )}
      </View>
    </View>
  );
}
