import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { API_URL } from "../constants/config";

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      // Call Go Backend
      await axios.post(`${API_URL}/register`, {
        email: email.toLowerCase(),
        password: password,
      });

      Alert.alert("Success", "Account created! Please log in.");
      navigation.navigate("Login"); // Go back to login so they can sign in
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || "Registration failed.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-gray-100 p-6">
      <Text className="text-3xl font-bold text-center mb-2 text-slate-800">
        Create Account
      </Text>
      <Text className="text-center text-gray-500 mb-8">
        Join MixMatch today
      </Text>

      <TextInput
        className="bg-white p-4 rounded-lg mb-4 border border-gray-300"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
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
        <TouchableOpacity
          className="bg-green-600 p-4 rounded-lg items-center shadow-sm"
          onPress={handleRegister}
        >
          <Text className="text-white font-bold text-lg">Sign Up</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="mt-6 items-center"
      >
        <Text className="text-blue-600">Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}
