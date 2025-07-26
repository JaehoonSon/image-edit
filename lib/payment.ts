import { TruckElectric } from "lucide-react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

const OFFERING_ID = "postureai_pro_offering";
const ENTITLEMENT_ID = "Pro";

export const makePayment = async (productId: string, title: string) => {
  const purchaseResult = await Purchases.purchaseProduct(productId);
  if (purchaseResult.productIdentifier === productId) {
  }
};

export const checkSubscription = async () => {
  return true;
};
