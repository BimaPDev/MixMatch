import React from "react";
import { View, ViewProps, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// --- NeoView Component ---
export const NeoView = ({ style, children, ...props }: ViewProps) => {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
};

// --- NeoIcon Component ---
interface NeoIconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  style?: any;
  focused?: boolean; // Added focused prop
  children?: React.ReactNode; // Added children prop
}

export const NeoIcon = ({
  name,
  size = 24,
  color = "black",
  style,
  focused,
  children,
}: NeoIconProps) => {
  // Optional: Change color or opacity if focused is passed
  const iconColor = focused ? "#0a7ea4" : color;

  return (
    <View style={[styles.iconContainer, style]}>
      <Ionicons name={name} size={size} color={iconColor} />
      {/* Render children if they exist (e.g., label text) */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
