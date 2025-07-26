import { Text } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "~/contexts/AuthProvider";

export default function UnAuthenticatedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isAuthenticated) {
    return <Redirect href="/(authenticated)" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Paywall" options={{ headerShown: false }} />
    </Stack>
  );
}
