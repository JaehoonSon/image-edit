import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "~/contexts/AuthProvider";
import LoadingScreen from "../Loading";

export default function UnAuthenticatedLayout() {
  const { isAuthenticated, isLoading, hasEntitlement, isEntitlementLoading } =
    useAuth();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading || isEntitlementLoading) {
    // return <Text>Loading...</Text>;
    return <LoadingScreen />;
  }

  if (isAuthenticated && hasEntitlement) {
    return <Redirect href="/(authenticated)" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
