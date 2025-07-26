import type { ExternalPathString } from "expo-router/build/typed-routes/types";

interface AppMetadata {
  privacyPolicyUrl: ExternalPathString;
  endUserLicenseAgreementUrl: ExternalPathString;
}

export const BASE_API_ENDPOINT = "http://109.199.116.115:8000";
// export const BASE_API_ENDPOINT = "http://127.0.0.1:8000";

export const appMetadata: AppMetadata = {
  privacyPolicyUrl:
    "https://chatgpt.com/c/686088a1-9ff0-800a-a16e-fa025f9c03c4",
  endUserLicenseAgreementUrl:
    "https://chatgpt.com/c/686088a1-9ff0-800a-a16e-fa025f9c03c4",
};

export const onboardingSlide = [
  {
    id: "1",
    title: "Lose Body Fat",
    description: "Test",
    image: require("./assets/solana.png"),
  },
  {
    id: "2",
    title: "One Picture, all-in-one Analysis",
    description: "Most accurate scan in the market",
    image: require("./assets/solana.png"),
  },
];
