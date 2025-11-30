import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "../api/client"; // Import our helper

// Hardcoded for testing - later this comes from Login
const TEST_USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

export default function CameraScreen({ navigation }: any) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Pick Image Logic
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // NEW
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 2. Upload Logic
  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);

    try {
      // Create Form Data
      const formData = new FormData();
      formData.append("user_id", TEST_USER_ID);
      formData.append("category", "mobile-upload");

      // React Native requires a specific format for files
      const filename = image.split("/").pop() || "upload.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      // @ts-ignore: FormData expects Blob, but React Native expects this object
      formData.append("image", { uri: image, name: filename, type });

      // Send to Backend
      const response = await uploadImage(formData);

      Alert.alert("Success", "Clothing item uploaded! AI is processing it.");
      setImage(null);

      // Optional: Navigate to Wardrobe to see result
      // navigation.navigate('Wardrobe');
    } catch (error: any) {
      console.error(error);

      // Extract the real error message from the server response
      const serverMessage =
        error.response?.data?.error || "Could not connect to server.";

      Alert.alert("Upload Failed", serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-6 text-gray-800">
        Add New Item
      </Text>

      {/* Image Preview */}
      <TouchableOpacity
        onPress={pickImage}
        className="w-64 h-64 bg-gray-300 rounded-xl items-center justify-center mb-6 overflow-hidden border-2 border-gray-400 border-dashed"
      >
        {image ? (
          <Image source={{ uri: image }} className="w-full h-full" />
        ) : (
          <Text className="text-gray-500">Tap to Pick Image</Text>
        )}
      </TouchableOpacity>

      {/* Upload Button */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Upload to Closet"
          onPress={handleUpload}
          disabled={!image}
        />
      )}
    </View>
  );
}
