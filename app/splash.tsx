// import { SplashScreen } from "expo-router";
// import { useAuth } from "~/contexts/AuthProvider";

// export function SplashScreenController() {
//   const { isLoading } = useAuth();

//   if (!isLoading) {
//     SplashScreen.hideAsync();
//   }

//   return null;
// }

import { SplashScreen } from "expo-router";
import { useAuth } from "~/contexts/AuthProvider";
import { useEffect, useState } from "react";

export function SplashScreenController() {
  const { isLoading, isEntitlementLoading } = useAuth();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    // Set minimum display time of 5 seconds
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Hide splash screen only when both conditions are met:
    // 1. Auth loading is complete (!isLoading)
    // 2. Minimum 3 seconds have elapsed (minTimeElapsed)
    if (!isLoading && !isEntitlementLoading && minTimeElapsed) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, minTimeElapsed]);

  return null;
}
