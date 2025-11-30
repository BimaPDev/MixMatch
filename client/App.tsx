import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/components/Navigation";

export default function App() {
  return (
    // ✅ CORRECT: The Container lives here at the root.
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}
