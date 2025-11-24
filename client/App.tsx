import React, { useState } from "react";
import { View, TouchableOpacity, StatusBar } from "react-native";
import { Home, Shirt, Calendar, User, Plus, Camera } from "lucide-react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// Import Theme Colors
import colors from "./src/constants/colors";

// Import Screens
import HomeScreen from "@/src/screens/HomeScreen";
import CameraScreen from "@/src/screens/CameraScreen";
import ClosetScreen from "@/src/screens/WardrobeScreen";
import PlannerScreen from "@/src/screens/PlannerScreen";
import ProfileScreen from "@/src/screens/ProfileScreen";

type Tab = "home" | "closet" | "camera" | "planner" | "profile";

// We split the content into a sub-component so we can use the 'useSafeAreaInsets' hook
const MainContent = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen />;
      case "closet":
        return <ClosetScreen />;
      case "camera":
        return <CameraScreen />;
      case "planner":
        return <PlannerScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        // THIS IS THE FIX: We apply padding equal to the notch height
        paddingTop: insets.top,
        paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
      }}
    >
      <StatusBar barStyle="dark-content" />

      {/* Main Screen Content */}
      <View style={{ flex: 1 }}>{renderContent()}</View>

      {/* Bottom Navigation */}
      <View className="absolute bottom-8 left-5 right-5 items-center">
        <View className="flex-row bg-neo-card border-2 border-neo-dark rounded-3xl py-4 px-6 w-full justify-between items-center shadow-lg">
          <TouchableOpacity onPress={() => setActiveTab("home")}>
            <Home
              size={24}
              color={activeTab === "home" ? colors.dark : "#9CA3AF"}
              strokeWidth={activeTab === "home" ? 3 : 2}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("closet")}>
            <Shirt
              size={24}
              color={activeTab === "closet" ? colors.dark : "#9CA3AF"}
              strokeWidth={activeTab === "closet" ? 3 : 2}
            />
          </TouchableOpacity>

          {/* Spacer for FAB */}
          <View className="w-16" />

          <TouchableOpacity onPress={() => setActiveTab("planner")}>
            <Calendar
              size={24}
              color={activeTab === "planner" ? colors.dark : "#9CA3AF"}
              strokeWidth={activeTab === "planner" ? 3 : 2}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("profile")}>
            <User
              size={24}
              color={activeTab === "profile" ? colors.dark : "#9CA3AF"}
              strokeWidth={activeTab === "profile" ? 3 : 2}
            />
          </TouchableOpacity>
        </View>

        {/* Center FAB */}
        <TouchableOpacity
          className="absolute -top-6 bg-neo-dark w-16 h-16 rounded-full justify-center items-center border-4 border-neo-background"
          activeOpacity={0.9}
          onPress={() => setActiveTab("camera")}
        >
          {activeTab === "camera" ? (
            <Plus
              size={32}
              color={colors.light}
              strokeWidth={3}
              style={{ transform: [{ rotate: "45deg" }] }}
            />
          ) : (
            <Camera size={28} color={colors.light} strokeWidth={2.5} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <MainContent />
    </SafeAreaProvider>
  );
}
