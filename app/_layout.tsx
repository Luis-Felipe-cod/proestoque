import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";

import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { ProductsProvider } from "../src/contexts/ProductsContext";
import { Colors } from "../src/constants/theme";

function NavigationGuard() {

  const { user, isLoading } = useAuth();
  const isAuthenticated = !!user; 

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === "(tabs)";

    if (inTabsGroup && !isAuthenticated) {
      router.replace("/(auth)/login");
    } else if (!inTabsGroup && isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary[600]} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <NavigationGuard />
      </ProductsProvider>
    </AuthProvider>
  );
}