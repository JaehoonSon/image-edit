import {
  BookA,
  BookText,
  ChevronRight,
  LogOut,
  Settings2,
  ShieldCheck,
  Subscript,
  Trash,
  User,
} from "lucide-react-native";
import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import Toast from "react-native-toast-message";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { showErrorToast, showSuccessToast } from "~/components/ui/toast";
import { H1, H2, H3, Large, Muted, P, Small } from "~/components/ui/typography";
import { useAuth } from "~/contexts/AuthProvider";
import { Sun } from "~/lib/icons/Sun";
import { Shield } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "~/lib/supabase";
import { playHaptic } from "~/lib/hapticSound";
import { appMetadata } from "~/config";
import Purchases from "react-native-purchases";

export default function Settings() {
  const { user, logout } = useAuth();

  const handle_dev = async () => {
    // const products = await list_all_products();
    // const checkSub = await checkSubscription();
    // console.log(products);
    // console.log(checkSub);
    // const info = await makePayment("subscription_monthly_1");
    // console.log(info);
  };

  const handle_privacy = async () => {
    playHaptic("soft");
    Linking.openURL(appMetadata.privacyPolicyUrl);
  };

  const handle_eula = async () => {
    playHaptic("soft");
    Linking.openURL(appMetadata.endUserLicenseAgreementUrl);
  };

  const handle_manage_subscription = async () => {
    playHaptic("soft");

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const proEntitlement = customerInfo.entitlements.active["Pro"];

      if (proEntitlement) {
        // expirationDate is string | null
        let expiryLabel: string;

        if (proEntitlement.expirationDate) {
          // safe to call new Date(...) because it's now a string
          expiryLabel = new Date(
            proEntitlement.expirationDate
          ).toLocaleDateString();
        } else {
          expiryLabel = "Unknown"; // or whatever fallback you prefer
        }

        const managementURL = customerInfo.managementURL;
        Alert.alert(
          "Pro Subscription",
          `Your Pro subscription is active and renews on ${expiryLabel}.`,
          [
            { text: "Close", style: "cancel" },
            {
              text: "Manage Subscription",
              onPress: () => {
                if (managementURL) {
                  Linking.openURL(managementURL);
                } else {
                  showErrorToast("Unable to open subscription manager");
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Pro Subscription",
          "You don't have an active Pro subscription."
        );
      }
    } catch (err) {
      showErrorToast("Error Managing Subscription");
    }
  };

  const handleLogout = async () => {
    try {
      playHaptic("light");
      await logout();
    } catch (err) {
      showErrorToast("Error signing out");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              playHaptic("light");
              await logout();
            } catch (err) {
              showErrorToast("Error deleting account");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <View className="flex-1 gap-5 p-2 bg-background">
      <SafeAreaView className="flex-1 items-center gap-y-4" edges={["top"]}>
        <H1 className="mr-auto">Settings</H1>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center">
            <Avatar
              alt="Rick Sanchez's Avatar"
              className="w-16 h-16 bg-primary"
            >
              <AvatarImage
                source={{ uri: user?.user_metadata?.avatar_url ?? "" }}
              />
              <AvatarFallback>
                <User strokeWidth={2.5} vectorEffect="uri" />
              </AvatarFallback>
            </Avatar>
            <View className="ml-4 flex flex-col">
              <H3 className="border-0">
                Hello{user?.email && ", " + user?.email.split("@")[0]}
              </H3>
              {user && user.created_at && (
                <Text className="ml-0">
                  Joined on {new Date(user?.created_at).toDateString()}
                </Text>
              )}
            </View>
          </CardHeader>
        </Card>
        <TouchableOpacity
          className="w-full"
          activeOpacity={0.7}
          onPress={handle_privacy}
        >
          <Card className="w-full justify-center">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <View className="flex flex-row items-center">
                <ShieldCheck fill={"black"} color="white" size={36} />
                <View className="flex flex-col ml-3">
                  <P className="font-semibold">Privacy</P>
                  <Muted>Data usage and privacy terms</Muted>
                </View>
              </View>
              <ChevronRight />
            </CardHeader>
          </Card>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full"
          activeOpacity={0.7}
          onPress={handle_eula}
        >
          <Card className="w-full justify-center">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <View className="flex flex-row items-center">
                <BookText fill={"black"} color="white" size={36} />
                <View className="flex flex-col ml-3">
                  <P className="font-semibold">EULA</P>
                  <Muted>View End User License Agreement</Muted>
                </View>
              </View>
              <ChevronRight />
            </CardHeader>
          </Card>
        </TouchableOpacity>

        {__DEV__ && (
          <TouchableOpacity
            className="w-full"
            activeOpacity={0.7}
            onPress={handle_dev}
          >
            <Card className="w-full justify-center">
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <View className="flex flex-row items-center">
                  <BookText fill={"black"} color="white" size={36} />
                  <View className="flex flex-col ml-3">
                    <P className="font-semibold">DEV</P>
                    <Muted>Development view only</Muted>
                  </View>
                </View>
                <ChevronRight />
              </CardHeader>
            </Card>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="w-full"
          activeOpacity={0.7}
          onPress={handle_manage_subscription}
        >
          <Card className="w-full justify-center">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <View className="flex flex-row items-center">
                <BookA fill={"black"} color="white" size={36} />
                <View className="flex flex-col ml-3">
                  <P className="font-semibold">Manage Subscription</P>
                  <Muted>Manage current subscription</Muted>
                </View>
              </View>
              <ChevronRight />
            </CardHeader>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full"
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <Card className="w-full justify-center bg-destructive/20">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <View className="flex flex-row items-center">
                <LogOut color="red" size={36} />
                <View className="flex flex-col ml-3">
                  <P className="font-semibold text-destructive">Logout</P>
                  <Muted className="text-destructive">
                    Logout of your account
                  </Muted>
                </View>
              </View>
              <ChevronRight color={"red"} />
            </CardHeader>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full"
          activeOpacity={0.7}
          onPress={handleDeleteAccount}
        >
          <Card className="w-full justify-center bg-destructive/20">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <View className="flex flex-row items-center">
                <Trash color="red" size={36} />
                <View className="flex flex-col ml-3">
                  <P className="font-semibold text-destructive">
                    Delete Account
                  </P>
                  <Muted className="text-destructive">
                    Delete Your Account
                  </Muted>
                </View>
              </View>
              <ChevronRight color={"red"} />
            </CardHeader>
          </Card>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
