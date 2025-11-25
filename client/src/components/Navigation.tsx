import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// DELETE THIS LINE: import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import WardrobeScreen from "../screens/WardrobeScreen";
import CategoryItemsScreen from "../screens/CategoryItemsScreen"; // Ensure this exists now

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    // DELETE <NavigationContainer> WRAPPER HERE
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ title: "Scan Item" }}
      />
      <Stack.Screen
        name="Closet"
        component={WardrobeScreen}
        options={{ title: "My Wardrobe" }}
      />
      <Stack.Screen
        name="CategoryItems"
        component={CategoryItemsScreen}
        options={{ title: "Items" }}
      />
    </Stack.Navigator>
    // DELETE CLOSING </NavigationContainer> TAG HERE
  );
}
