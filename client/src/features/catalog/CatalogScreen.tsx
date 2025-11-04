import { useEffect, useState, useCallback } from "react";
import { FlatList, Image, View, RefreshControl, Pressable, Alert, ActivityIndicator, Text } from "react-native";

const API = process.env.EXPO_PUBLIC_API_BASE!;

type Item = { id: string; url: string; thumb_url: string; created_at?: string };

export default function CatalogScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseItems = (text: string): Item[] => {
    try {
      // Extract first JSON array to be safe
      const m = text.match(/\[[\s\S]*\]/);
      const arr = JSON.parse(m ? m[0] : text);
      if (Array.isArray(arr)) return arr as Item[];
      return [];
    } catch {
      console.log("items raw:", text.slice(0, 200));
      return [];
    }
  };

  const fetchPage = async (reset=false) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const nextOffset = reset ? 0 : offset;
      const res = await fetch(`${API}/api/items?limit=60&offset=${nextOffset}`);
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status} ${text.slice(0,120)}`);
      const page = parseItems(text);
      setItems(reset ? page : [...items, ...page]);
      setOffset(nextOffset + page.length);
    } catch (e: any) {
      setError(e?.message ?? "failed to load");
      // keep items as-is; don’t crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPage(true); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPage(true);
    setRefreshing(false);
  }, []);

  const onEndReached = () => fetchPage(false);

  const onLongPress = (id: string) => {
    Alert.alert("Delete?", "Remove this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          try {
            const r = await fetch(`${API}/api/items/${id}`, { method: "DELETE" });
            if (r.status !== 204) console.log("delete status", r.status, await r.text());
          } finally {
            setItems(prev => prev.filter(x => x.id !== id));
          }
        } 
      }
    ]);
  };

  if (loading && items.length === 0) {
    return (
      <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}>
        <ActivityIndicator />
        {error ? <Text style={{ color: "red", marginTop: 8 }}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(x) => x.id}
      numColumns={3}
      contentContainerStyle={{ padding: 2 }}
      onEndReached={onEndReached}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: "#999" }}>{error ? `Error: ${error}` : "No items yet"}</Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable style={{ width: "33.333%", aspectRatio: 1, padding: 2 }} onLongPress={() => onLongPress(item.id)}>
          <Image source={{ uri: `${API}${item.thumb_url}` }} style={{ flex: 1, backgroundColor: "#222" }} />
        </Pressable>
      )}
    />
  );
}
