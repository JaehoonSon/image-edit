import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "~/contexts/AuthProvider";
import LoadingScreen from "../Loading";

export default function AuthenticatedLayout() {
  const { isAuthenticated, hasEntitlement, isLoading, isEntitlementLoading } =
    useAuth();

  // Show loading screen while auth or entitlement status is being determined
  if (isLoading || isEntitlementLoading) {
    return <LoadingScreen />;
  }

  // Double-check: If user somehow got here without auth+entitlement, redirect away
  // This is a safety net in case Stack.Protected doesn't catch it
  if (!isAuthenticated || !hasEntitlement) {
    console.log(
      "Authenticated layout: User should not be here, redirecting..."
    );
    console.log(
      "isAuthenticated:",
      isAuthenticated,
      "hasEntitlement:",
      hasEntitlement
    );
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: "default" }}>
      <Stack.Screen name="index" options={{ animation: "none" }} />
    </Stack>
  );
}
