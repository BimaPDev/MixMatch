import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { API_URL } from "../constants/config";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // 1. Send Credentials to Go
      const response = await axios.post(`${API_URL}/login`, {
        email: email.toLowerCase(),
        password: password,
      });

      // 2. Get the Token
      const { token } = response.data;

      // 3. Save it securely on the phone
      await SecureStore.setItemAsync("user_token", token);

      // 4. Navigate to the App
      navigation.replace("Home");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Login Failed", "Check your email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-gray-100 p-6">
      <Text className="text-3xl font-bold text-center mb-8 text-slate-800">
        MixMatch
      </Text>

      <TextInput
        className="bg-white p-4 rounded-lg mb-4 border border-gray-300"
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="bg-white p-4 rounded-lg mb-6 border border-gray-300"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <>
          <TouchableOpacity
            className="bg-blue-600 p-4 rounded-lg items-center shadow-sm"
            onPress={handleLogin}
          >
            <Text className="text-white font-bold text-lg">Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            className="mt-6 items-center"
          >
            <Text className="text-blue-600">Create Account</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
