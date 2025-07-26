import {
  BookText,
  ChevronRight,
  LogOut,
  Settings2,
  ShieldCheck,
  User,
} from "lucide-react-native";
import { View, Text, TouchableOpacity } from "react-native";
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

export default function Settings() {
  const { user } = useAuth();

  return (
    <View className="flex-1 gap-5 p-2 bg-secondary/30">
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
                {/* <Text>RS</Text> */}
                <User />
              </AvatarFallback>
            </Avatar>
            <View className="ml-4">
              <H2 className="border-0">
                Hello {user?.email && ", " + user?.email}
              </H2>
              {user?.email && <P>{user?.email}</P>}
            </View>
          </CardHeader>
        </Card>
        <TouchableOpacity className="w-full" activeOpacity={0.7}>
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
        <TouchableOpacity className="w-full" activeOpacity={0.7}>
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
        <TouchableOpacity className="w-full" activeOpacity={0.7}>
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
      </SafeAreaView>
    </View>
  );
}
