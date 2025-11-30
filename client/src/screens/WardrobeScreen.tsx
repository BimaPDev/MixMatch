import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import { getWardrobe } from "../api/client";

const TEST_USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

// Replace 'host.docker.internal' because Android/iOS can't read that
// We use a regex to swap it with your local IP dynamically
const fixUrl = (url: string): string | undefined => {
  if (!url) return undefined;
  return url.replace("host.docker.internal", "10.0.0.74");
};

export default function WardrobeScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const res = await getWardrobe(TEST_USER_ID);
      setItems(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    // Logic: Prefer the transparent AI image, fallback to original
    const displayImage = item.processed_image_url || item.image_url;
    const finalUrl = fixUrl(displayImage);

    return (
      <View className="flex-1 m-2 p-2 bg-white rounded-lg shadow-sm items-center">
        <Image
          source={{ uri: finalUrl }}
          className="w-32 h-32 rounded-md"
          resizeMode="contain"
        />
        <Text className="font-bold mt-2 capitalize">{item.category}</Text>
        <Text className="text-xs text-gray-500">{item.processing_status}</Text>

        {/* Helper Badge for AI status */}
        {item.processing_status === "completed" && (
          <View className="absolute top-1 right-1 bg-green-100 px-2 py-1 rounded-full">
            <Text className="text-green-800 text-[10px]">AI Ready</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 pt-10 px-2">
      <Text className="text-3xl font-bold mb-4 ml-2 text-gray-800">
        My Closet
      </Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
      />
    </View>
  );
}
