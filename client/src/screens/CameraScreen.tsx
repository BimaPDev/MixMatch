import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ViewStyle,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  CameraType,
  CameraCapturedPicture,
} from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { RefreshCw, Zap, Check, X } from "lucide-react-native";
import { NeoView } from "@/src/components/Navigation";
import colors from "../constants/colors";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [flash, setFlash] = useState<"off" | "on">("off");

  // THE FIX: Explicitly tell TypeScript this Ref holds a CameraView
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      if (!permission?.granted) await requestPermission();
      if (!mediaPermission?.granted) await requestMediaPermission();
    })();
  }, []);

  if (!permission || !mediaPermission) {
    return <View className="flex-1 bg-neo-background" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-neo-background justify-center items-center p-5">
        <Text className="text-xl font-black text-neo-dark text-center mb-4">
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-neo-primary px-6 py-3 border-2 border-neo-dark rounded-xl"
        >
          <Text className="font-bold text-neo-dark">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true,
          exif: false,
        });
        // photoData might be undefined if something goes wrong, check strictly
        if (photoData) {
          setPhoto(photoData);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to take picture");
      }
    }
  };

  const savePhoto = async () => {
    if (photo) {
      try {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        Alert.alert("Saved!", "Photo added to your gallery ✨");
        setPhoto(null);
      } catch (error) {
        Alert.alert("Error", "Could not save photo");
      }
    }
  };

  if (photo) {
    return (
      <View className="flex-1 bg-neo-background p-5">
        <Text className="text-3xl font-black text-neo-dark mb-4 mt-2">
          Nice Shot!
        </Text>

        <NeoView
          color="bg-white"
          style="flex-1 mb-6"
          innerStyle="p-0 overflow-hidden relative"
        >
          <Image
            source={{ uri: photo.uri }}
            style={{ flex: 1 }}
            resizeMode="cover"
          />
        </NeoView>

        <View className="flex-row gap-4 h-20">
          <TouchableOpacity
            onPress={() => setPhoto(null)}
            className="flex-1 bg-neo-card border-2 border-neo-dark rounded-xl justify-center items-center flex-row gap-2"
          >
            <X size={24} color={colors.accent} strokeWidth={3} />
            <Text className="font-black text-neo-dark">Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={savePhoto}
            className="flex-1 bg-neo-secondary border-2 border-neo-dark rounded-xl justify-center items-center flex-row gap-2"
          >
            <Check size={24} color={colors.dark} strokeWidth={3} />
            <Text className="font-black text-neo-dark">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neo-background pt-5">
      <View className="flex-row justify-between items-center px-5 mb-4 z-10">
        <Text className="text-3xl font-black text-neo-light absolute top-0 left-5 drop-shadow-md shadow-black">
          Snap It!
        </Text>
        <View className="flex-1" />
        <TouchableOpacity
          onPress={toggleFlash}
          className={`p-3 border-2 border-neo-dark rounded-full ${
            flash === "on" ? "bg-neo-secondary" : "bg-neo-card"
          }`}
        >
          <Zap
            size={24}
            color={colors.dark}
            fill={flash === "on" ? colors.dark : "none"}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 mt-2 mx-2 mb-2 rounded-3xl overflow-hidden border-4 border-neo-dark relative">
        <CameraView
          style={{ flex: 1 }}
          facing={facing}
          flash={flash}
          ref={cameraRef}
        />

        <View className="absolute top-4 left-4 w-12 h-12 border-t-8 border-l-8 border-neo-secondary opacity-50 rounded-tl-xl" />
        <View className="absolute top-4 right-4 w-12 h-12 border-t-8 border-r-8 border-neo-secondary opacity-50 rounded-tr-xl" />
        <View className="absolute bottom-4 left-4 w-12 h-12 border-b-8 border-l-8 border-neo-secondary opacity-50 rounded-bl-xl" />
        <View className="absolute bottom-4 right-4 w-12 h-12 border-b-8 border-r-8 border-neo-secondary opacity-50 rounded-br-xl" />
      </View>

      <View className="h-32 flex-row justify-between items-center px-8 pb-8">
        <TouchableOpacity className="w-14 h-14 justify-center items-center border-2 border-neo-dark rounded-xl bg-neo-pastelPink">
          <View className="w-10 h-10 border border-neo-dark bg-neo-card rounded-lg" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={takePicture}
          className="w-20 h-20 rounded-full border-4 border-neo-dark bg-neo-card justify-center items-center"
          style={{ elevation: 5 }}
        >
          <View className="w-16 h-16 rounded-full bg-neo-accent border-2 border-neo-dark" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleCameraFacing}
          className="w-14 h-14 justify-center items-center border-2 border-neo-dark rounded-full bg-neo-card"
        >
          <RefreshCw size={24} color={colors.dark} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
