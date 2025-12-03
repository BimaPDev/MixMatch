import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen({ navigation }: any) {

  const handleLogout = async () => {
    try {
      // 1. Delete the token from storage
      await SecureStore.deleteItemAsync('user_token');
      
      // 2. Reset navigation to Login (so they can't swipe back)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      Alert.alert("Error", "Failed to log out");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-4xl font-bold mb-10 text-slate-800">MixMatch</Text>
      
      {/* Camera Action */}
      <TouchableOpacity 
        className="bg-blue-600 px-8 py-4 rounded-full mb-4 w-64 items-center shadow-lg"
        onPress={() => navigation.navigate('Camera')}
      >
        <Text className="text-white font-bold text-lg">📸 Add New Item</Text>
      </TouchableOpacity>

      {/* Wardrobe Action */}
      <TouchableOpacity 
        className="bg-slate-200 px-8 py-4 rounded-full mb-12 w-64 items-center"
        onPress={() => navigation.navigate('Wardrobe')}
      >
        <Text className="text-slate-800 font-bold text-lg">👕 My Closet</Text>
      </TouchableOpacity>

      {/* Logout Action */}
      <TouchableOpacity 
        onPress={handleLogout}
        className="border-red-500 border-2 px-8 py-2 rounded-full w-64 items-center absolute bottom-10"
      >
        <Text className="text-red-500 font-bold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}