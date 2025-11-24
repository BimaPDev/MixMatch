import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  GestureResponderEvent,
} from "react-native";
import Svg, { Path, Circle, G } from "react-native-svg";
import { LucideIcon } from "lucide-react-native";
import colors from "@/src/constants/colors";

interface NeoViewProps {
  children?: React.ReactNode;
  style?: string; // Tailwind class string
  innerStyle?: string; // Tailwind class string
  color?: string; // Tailwind class string (e.g., 'bg-neo-card')
  borderRadius?: string; // Tailwind class string
  shadowOffset?: number;
}

export const NeoView: React.FC<NeoViewProps> = ({
  children,
  style,
  innerStyle,
  color = "bg-neo-card",
  borderRadius = "rounded-2xl",
  shadowOffset = 4,
}) => {
  return (
    <View className={`mr-1 mb-1 ${style || ""}`}>
      <View
        className={`absolute bg-neo-dark ${borderRadius}`}
        style={{
          top: shadowOffset,
          left: shadowOffset,
          right: -shadowOffset,
          bottom: -shadowOffset,
        }}
      />
      <View
        className={`p-4 border-2 border-neo-dark ${color} ${borderRadius} ${
          innerStyle || ""
        }`}
      >
        {children}
      </View>
    </View>
  );
};

interface NeoButtonProps {
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: "primary" | "secondary" | "danger" | "outline" | "black";
  style?: string; // Tailwind class string
  icon?: LucideIcon;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  children,
  onPress,
  variant = "primary",
  style,
  icon: Icon,
}) => {
  const variantMap: Record<string, string> = {
    primary: "bg-neo-primary",
    secondary: "bg-neo-secondary",
    danger: "bg-neo-accent",
    outline: "bg-neo-card",
    black: "bg-neo-dark",
  };

  const bgColor = variantMap[variant] || "bg-neo-primary";
  const textColor = variant === "black" ? "text-neo-light" : "text-neo-dark";
  const iconColor = variant === "black" ? colors.light : colors.dark;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className={`h-14 ${style || ""}`}
    >
      <View className="absolute top-[3px] left-[3px] -right-[3px] -bottom-[3px] bg-neo-dark rounded-xl" />
      <View
        className={`flex-1 flex-row justify-center items-center border-2 border-neo-dark rounded-xl ${bgColor}`}
      >
        {Icon && (
          <Icon
            size={20}
            color={iconColor}
            strokeWidth={2.5}
            style={{ marginRight: 8 }}
          />
        )}
        <Text className={`text-base font-extrabold ${textColor}`}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface BlobProps {
  mood?: "happy" | "excited" | "cool";
  color?: string;
}

export const BlobCharacter: React.FC<BlobProps> = ({
  mood = "happy",
  color = colors.primary,
}) => {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      <G transform="translate(100, 100)">
        <Path
          fill={color}
          stroke={colors.dark}
          strokeWidth="4"
          d="M45.7,-51.3C59.3,-43.3,70.6,-30.8,74.5,-16.4C78.4,-1.9,74.9,14.5,65.8,27.8C56.7,41.1,42,51.4,26.6,58.3C11.2,65.2,-4.9,68.7,-20.1,64.8C-35.3,60.9,-49.6,49.6,-59.1,35.2C-68.6,20.8,-73.3,3.3,-68.8,-11.8C-64.3,-26.9,-50.6,-39.6,-37.2,-47.7C-23.8,-55.8,-10.7,-59.3,1.6,-61.2C13.9,-63.1,27.8,-63.4,45.7,-51.3Z"
        />
        <Circle
          cx="-20"
          cy="-10"
          r="8"
          fill="white"
          stroke={colors.dark}
          strokeWidth="2"
        />
        <Circle cx="-20" cy="-10" r="3" fill={colors.dark} />
        <Circle
          cx="20"
          cy="-10"
          r="8"
          fill="white"
          stroke={colors.dark}
          strokeWidth="2"
        />
        <Circle cx="20" cy="-10" r="3" fill={colors.dark} />

        {mood === "happy" && (
          <Path
            d="M-15 15 Q0 25 15 15"
            fill="none"
            stroke={colors.dark}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        {mood === "excited" && (
          <Path
            d="M-15 15 Q0 30 15 15 Z"
            fill="white"
            stroke={colors.dark}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        {mood === "cool" && (
          <G>
            <Path d="M-25 -5 L-5 -5 L-15 10 Z" fill={colors.dark} />
          </G>
        )}
      </G>
    </Svg>
  );
};
