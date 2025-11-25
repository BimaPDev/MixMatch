import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  CameraType,
  CameraCapturedPicture,
} from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { RefreshCw, Zap, Check, X, Tag, Palette } from "lucide-react-native";
import NeoView from "@/src/components/Navigation";
import colors from "../constants/colors";
import client from "../api/client";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [flash, setFlash] = useState<"off" | "on">("off");
  const [uploading, setUploading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    category: string;
    color: string;
  } | null>(null);

  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      if (!permission?.granted) await requestPermission();
      if (!mediaPermission?.granted) await requestMediaPermission();
    })();
  }, []);

  const handleRetake = () => {
    setPhoto(null);
    setAiResult(null);
  };

  if (!permission || !mediaPermission)
    return <View className="flex-1 bg-neo-background" />;

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-neo-background justify-center items-center p-5">
        <Text className="text-xl font-black text-neo-dark text-center mb-4">
          Camera Access Needed
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

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
          exif: false,
        });
        if (photoData) setPhoto(photoData);
      } catch (error) {
        Alert.alert("Error", "Failed to take picture");
      }
    }
  };

  const uploadPhoto = async () => {
    if (!photo) return;
    setUploading(true);

    try {
      const formData = new FormData();
      // @ts-ignore
      formData.append("image", {
        uri: photo.uri,
        name: "upload.jpg",
        type: "image/jpeg",
      });

      const response = await client.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAiResult({
        category: response.data.category || "Unknown",
        color: response.data.color || "Unknown",
      });
    } catch (error: any) {
      Alert.alert("Upload Failed", "Could not connect to server");
    } finally {
      setUploading(false);
    }
  };

  // Preview Mode
  if (photo) {
    return (
      <View className="flex-1 bg-neo-background p-5 pt-12">
        <Text className="text-3xl font-black text-neo-dark mb-4">
          {aiResult ? "Success!" : "Nice Shot!"}
        </Text>

        <View
          style={{
            flex: 1,
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 3,
            borderColor: colors.dark,
            marginBottom: 20,
            backgroundColor: "#000",
            position: "relative",
          }}
        >
          <Image
            source={{ uri: photo.uri }}
            style={{
              width: "100%",
              height: "100%",
              opacity: aiResult ? 0.7 : 1,
            }}
            resizeMode="contain"
          />
          {aiResult && (
            <View className="absolute bottom-0 left-0 right-0 bg-white/90 p-4 border-t-2 border-neo-dark">
              <View className="flex-row items-center mb-2">
                <Tag size={20} color={colors.primary} strokeWidth={3} />
                <Text className="ml-2 font-bold text-lg text-neo-dark capitalize">
                  {aiResult.category}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Palette size={20} color={colors.accent} strokeWidth={3} />
                <Text className="ml-2 font-bold text-lg text-neo-dark capitalize">
                  {aiResult.color}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View className="flex-row gap-4 h-16 mb-2">
          {!aiResult ? (
            <>
              <TouchableOpacity
                onPress={handleRetake}
                disabled={uploading}
                className="flex-1 bg-neo-card border-2 border-neo-dark rounded-xl justify-center items-center flex-row gap-2"
              >
                <X size={24} color={colors.accent} strokeWidth={3} />
                <Text className="font-black text-neo-dark">Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={uploadPhoto}
                disabled={uploading}
                className={`flex-1 border-2 border-neo-dark rounded-xl justify-center items-center flex-row gap-2 ${
                  uploading ? "bg-gray-300" : "bg-neo-secondary"
                }`}
              >
                {uploading ? (
                  <ActivityIndicator color={colors.dark} />
                ) : (
                  <Check size={24} color={colors.dark} strokeWidth={3} />
                )}
                <Text className="font-black text-neo-dark">
                  {uploading ? "Thinking..." : "Save"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={handleRetake}
              className="flex-1 bg-neo-primary border-2 border-neo-dark rounded-xl justify-center items-center flex-row gap-2"
            >
              <RefreshCw size={24} color={colors.dark} strokeWidth={3} />
              <Text className="font-black text-neo-dark">Add Another</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // Camera View
  return (
    <View className="flex-1 bg-neo-background pt-5">
      <View className="flex-row justify-between items-center px-5 mb-4 z-10">
        <Text className="text-3xl font-black text-neo-dark">Snap It!</Text>
        <TouchableOpacity
          onPress={() => setFlash((f) => (f === "off" ? "on" : "off"))}
          className={`p-3 border-2 border-neo-dark rounded-full ${
            flash === "on" ? "bg-neo-secondary" : "bg-neo-card"
          }`}
        >
          <Zap size={24} color={colors.dark} />
        </TouchableOpacity>
      </View>

      <View className="flex-1 mx-2 mb-2 rounded-3xl overflow-hidden border-4 border-neo-dark">
        <CameraView
          style={{ flex: 1 }}
          facing={facing}
          flash={flash}
          ref={cameraRef}
        />
      </View>

      <View className="h-32 flex-row justify-center items-center gap-10 pb-8">
        <TouchableOpacity
          onPress={takePicture}
          className="w-20 h-20 rounded-full border-4 border-neo-dark bg-neo-card justify-center items-center"
        >
          <View className="w-16 h-16 rounded-full bg-neo-accent border-2 border-neo-dark" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
