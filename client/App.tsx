import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

// This imports your actual navigator configuration
import Navigation from "./src/components/Navigation";

export default function App() {
  return (
    <SafeAreaProvider>
      {/* NavigationContainer provides the "navigation object" 
        that your screens are looking for.
      */}
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Navigation />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
