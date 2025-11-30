import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import WardrobeScreen from "../screens/WardrobeScreen";
import CategoryItemsScreen from "../screens/CategoryItemsScreen";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator initialRouteName="Login">
      {/* Auth Screen */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      {/* App Screens */}
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
