import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator } from "react-native";
import { getWardrobe } from "../api/client";

const TEST_USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

// Helper to fix localhost IP issue on phones
const fixUrl = (url: string) => {
  if (!url) return undefined;
  // Update this IP to match your computer's IP!
  return url.replace("host.docker.internal", "192.168.1.69");
};

export default function CategoryItemsScreen({ route }: any) {
  // 1. Get the category name passed via navigation
  const { category } = route.params || { category: "all" };

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        // Fetch everything and filter client-side (Simple for now)
        const res = await getWardrobe(TEST_USER_ID);
        const allItems = res.data;

        // Filter by category
        const filtered = allItems.filter(
          (item: any) => item.category.toLowerCase() === category.toLowerCase()
        );

        setItems(filtered);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [category]);

  if (loading) return <ActivityIndicator size="large" className="mt-10" />;

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold mb-4 text-gray-800 capitalize">
        {category}
      </Text>

      {items.length === 0 ? (
        <Text className="text-gray-500 italic">
          No items found in this category.
        </Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <View className="flex-1 m-2 bg-white p-2 rounded-lg shadow-sm items-center">
              <Image
                source={{
                  uri: fixUrl(item.processed_image_url || item.image_url),
                }}
                className="w-32 h-32 rounded-md"
                resizeMode="contain"
              />
              <Text className="text-xs text-gray-400 mt-2">
                {item.processing_status}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
