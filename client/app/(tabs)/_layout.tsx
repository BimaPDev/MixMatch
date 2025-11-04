import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="p1" options={{ title: "P1" }} />
      <Tabs.Screen name="p2" options={{ title: "P2" }} />
      <Tabs.Screen name="camera" options={{ title: "Camera" }} />
      <Tabs.Screen name="catalog" options={{ title: "Catalog" }} />
    </Tabs>
  );
}
