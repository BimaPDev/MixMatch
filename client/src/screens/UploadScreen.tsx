import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "../api/client";
import { Ionicons } from "@expo/vector-icons";

export default function UploadScreen({ navigation }: any) {
    const [image, setImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleUpload = async () => {
        if (!image) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", {
                uri: image,
                name: "upload.jpg",
                type: "image/jpeg",
            } as any);
            formData.append("category", "top"); // Default for now, can add picker later

            await uploadImage(formData);
            Alert.alert("Success", "Item uploaded successfully!");
            setImage(null);
            navigation.navigate("Wardrobe");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-gray-50 p-6">
            <Text className="text-2xl font-bold mb-8 text-gray-800">Add New Item</Text>

            <TouchableOpacity
                onPress={pickImage}
                className="w-64 h-64 bg-gray-200 rounded-xl items-center justify-center mb-8 border-2 border-dashed border-gray-400"
            >
                {image ? (
                    <Image source={{ uri: image }} className="w-full h-full rounded-xl" />
                ) : (
                    <View className="items-center">
                        <Ionicons name="camera-outline" size={48} color="gray" />
                        <Text className="text-gray-500 mt-2">Tap to select image</Text>
                    </View>
                )}
            </TouchableOpacity>

            {uploading ? (
                <ActivityIndicator size="large" color="#2563eb" />
            ) : (
                <TouchableOpacity
                    onPress={handleUpload}
                    disabled={!image}
                    className={`w-full p-4 rounded-lg items-center ${image ? "bg-blue-600" : "bg-gray-300"
                        }`}
                >
                    <Text className="text-white font-bold text-lg">Upload Item</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
