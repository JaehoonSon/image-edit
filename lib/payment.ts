import { TruckElectric } from "lucide-react-native";
import Purchases, {
  PurchasesOfferings,
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  PurchasesStoreProduct,
} from "react-native-purchases";
import { supabase } from "./supabase";

const OFFERING_ID = "Offering_1";
const ENTITLEMENT_ID = "Pro";
const PRODUCT_IDS = ["subscription_monthly_1", "subscription_weekly_1"];


export async function identifyRevenueCatUser() {
  // Get the currently signed-in Supabase user
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) return null;

  // Make sure RC knows who this user is
  await Purchases.logIn(user.id);

  // (Optional but useful for support/analytics)
  // await Purchases.setAttributes({
  //   $email: user.email!!,
  //   supabase_uid: user.id,
  // });

  return user.id;
}

// List all products within the offering id
export const list_all_products = async (): Promise<PurchasesStoreProduct[]> => {
  try {
    const products: PurchasesStoreProduct[] = await Purchases.getProducts(
      PRODUCT_IDS,
      Purchases.PURCHASE_TYPE.SUBS
    );
    return products;
  } catch (e) {
    console.error("Error fetching products:", e);
    return [];
  }
};

// Products within the offering id, purchase it.
export const makePayment = async (
  productId: string): Promise<CustomerInfo | null> => {
  try {
    const purchaseResult = await Purchases.purchaseProduct(productId);
    const { customerInfo, productIdentifier } = purchaseResult;
    if (productIdentifier === productId) {
      console.log(`✅ Successfully purchased ${productId}`);
    }
    return customerInfo;
  } catch (e: any) {
    // User cancel is a normal flow; others you may want to report
    if (!e.userCancelled) {
      console.error(`❌ Error purchasing ${productId}:`, e);
    }
    return null;
  }
};
// Checks whether user have the entitlement
export const checkSubscription = async (): Promise<boolean> => {
  try {
    // await identifyRevenueCatUser();
    const customerInfo = await Purchases.getCustomerInfo();
    console.log("Entielement?,", Boolean(customerInfo.entitlements.active[ENTITLEMENT_ID]))
    return Boolean(customerInfo.entitlements.active[ENTITLEMENT_ID]);
  } catch (e) {
    console.error("Error checking subscription:", e);
    return false;
  }
};