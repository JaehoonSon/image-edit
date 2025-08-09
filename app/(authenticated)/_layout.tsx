import { Text } from "react-native";
import { Redirect, Stack, Tabs } from "expo-router";
import { useAuth } from "~/contexts/AuthProvider";
import { ThemeToggle } from "~/components/ThemeToggle";
import LoadingScreen from "../Loading";

export default function AuthenticatedLayout() {
  const { isAuthenticated, isLoading, hasEntitlement, isEntitlementLoading } =
    useAuth();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading || isEntitlementLoading) {
    // return <Text>Loading...</Text>;
    return <LoadingScreen />;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!isAuthenticated || !hasEntitlement) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/(unauthenticated)" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    // <Stack />
    // <Tabs>
    //   <Tabs.Screen name="index" />
    //   <Tabs.Screen name="Stats" />
    //   <Tabs.Screen name="Todo" />
    //   <Tabs.Screen
    //     name="settings"
    //     options={{ headerRight: () => <ThemeToggle /> }}
    //   />
    //   <Tabs.Screen name="MainApp" options={{ href: null }} />
    // </Tabs>
    <Stack screenOptions={{ headerShown: false, animation: "default" }}>
      <Tabs.Screen name="index" options={{ animation: "none" }} />
    </Stack>
  );
}
