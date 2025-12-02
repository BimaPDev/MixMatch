import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Share } from "react-native";
import { generateShareLink } from "../api/client";
import { Ionicons } from "@expo/vector-icons";

export default function ShareScreen() {
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateLink = async () => {
        setLoading(true);
        try {
            const response = await generateShareLink();
            const { web_url } = response.data;
            setShareUrl(web_url);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to generate share link.");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        if (!shareUrl) return;
        try {
            await Share.share({
                message: `Check out my wardrobe on MixMatch! ${shareUrl}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-gray-50 p-6">
            <Ionicons name="share-social-outline" size={64} color="#2563eb" className="mb-6" />
            <Text className="text-2xl font-bold mb-2 text-gray-800">Share Your Style</Text>
            <Text className="text-gray-500 text-center mb-8 px-4">
                Generate a unique link to share your wardrobe with friends and get their feedback.
            </Text>

            {shareUrl ? (
                <View className="w-full items-center">
                    <View className="bg-white p-4 rounded-lg border border-gray-200 w-full mb-6">
                        <Text className="text-center text-gray-600 font-medium">{shareUrl}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleShare}
                        className="bg-blue-600 w-full p-4 rounded-lg items-center flex-row justify-center"
                    >
                        <Ionicons name="copy-outline" size={20} color="white" className="mr-2" />
                        <Text className="text-white font-bold text-lg">Share Link</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setShareUrl(null)}
                        className="mt-4"
                    >
                        <Text className="text-blue-600">Generate New Link</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={handleGenerateLink}
                    disabled={loading}
                    className="bg-blue-600 w-full p-4 rounded-lg items-center"
                >
                    <Text className="text-white font-bold text-lg">
                        {loading ? "Generating..." : "Generate Link"}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
