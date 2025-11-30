import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import WardrobeScreen from "../screens/WardrobeScreen";
import CategoryItemsScreen from "../screens/CategoryItemsScreen";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    // ⚠️ CHANGED: No NavigationContainer here! Just the Stack.
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ title: "Add Item" }}
      />
      <Stack.Screen
        name="Wardrobe"
        component={WardrobeScreen}
        options={{ title: "My Closet" }}
      />
      <Stack.Screen
        name="CategoryItems"
        component={CategoryItemsScreen}
        options={({ route }: any) => ({ title: route.params.category })}
      />
    </Stack.Navigator>
  );
}
