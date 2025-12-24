import { router } from "expo-router";
import { InfoIcon, Check } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeOutDown,
  FadeOutRight,
  Layout,
  SlideInLeft,
  SlideInRight,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { CountUp } from "~/components/ui/count-up";
import { Text } from "~/components/ui/text";
import { H1, H2, P } from "~/components/ui/typography";
import { playHaptic } from "~/lib/hapticSound";
import { posthog } from "~/lib/posthog";
import HeroScreen from "./Hero";
import SocialProof from "./SocialProof";
import GoalStep from "./GoalStep";
import PlatformStep from "./PlatformStep";
import SkinStep from "./SkinStep";

// const GoalStep = ({ onAnswer, currentAnswer = [] }) => {
//   const toggle = (val) => {
//     onAnswer((prev = []) =>
//       prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
//     );
//   };
//   const isSelected = (val) => currentAnswer?.includes?.(val);
//   return (
//     <View className="mx-auto w-[90%] gap-y-4">
//       <View className="gap-y-4">
//         <H2>How do you want to use the app?</H2>
//         <P>Select all of the options that apply to you</P>
//       </View>
//       <View className="gap-y-4">
//         <Button
//           variant={isSelected("touch") ? "default" : "secondary"}
//           size="xl"
//           onPress={() => toggle("touch")}
//         >
//           <Text>Touch up my selfies for Instagram</Text>
//         </Button>
//         <Button
//           variant={isSelected("experiment") ? "default" : "secondary"}
//           size="xl"
//           onPress={() => toggle("experiment")}
//         >
//           <Text>Experiment with different looks</Text>
//         </Button>
//         <Button
//           variant={isSelected("smooth") ? "default" : "secondary"}
//           size="xl"
//           onPress={() => toggle("smooth")}
//         >
//           <Text>Smooth skin and brighten eye</Text>
//         </Button>
//         <Button
//           variant={isSelected("customize") ? "default" : "secondary"}
//           size="xl"
//           onPress={() => toggle("customize")}
//         >
//           <Text>Customize facial features</Text>
//         </Button>
//       </View>
//     </View>
//   );
// };

const AgeStep = ({ onAnswer, currentAnswer }) => (
  <View className="mx-auto w-[90%] gap-y-4">
    <View className="gap-y-4">
      <H2>What's your age range?</H2>
      <P>This helps us personalize your experience</P>
    </View>
    <View className="gap-y-4">
      <Button
        variant={currentAnswer === "18-25" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("18-25")}
      >
        <Text>18-25</Text>
      </Button>
      <Button
        variant={currentAnswer === "26-35" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("26-35")}
      >
        <Text>26-35</Text>
      </Button>
      <Button
        variant={currentAnswer === "36-45" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("36-45")}
      >
        <Text>36-45</Text>
      </Button>
      <Button
        variant={currentAnswer === "46+" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("46+")}
      >
        <Text>46+</Text>
      </Button>
    </View>
  </View>
);

// const PlatformStep = ({ onAnswer, currentAnswer }) => (
//   <View className="mx-auto w-[90%] gap-y-4">
//     <View className="gap-y-4">
//       <H2>Where do you post the most?</H2>
//       <P>Select where you want to optimize it for</P>
//     </View>
//     <View className="gap-y-4">
//       <Button
//         variant={currentAnswer === "instagram" ? "default" : "secondary"}
//         size="xl"
//         onPress={() => onAnswer("instagram")}
//       >
//         <Text>Instagram</Text>
//       </Button>
//       <Button
//         variant={currentAnswer === "tiktok" ? "default" : "secondary"}
//         size="xl"
//         onPress={() => onAnswer("tiktok")}
//       >
//         <Text>TikTok</Text>
//       </Button>
//       <Button
//         variant={currentAnswer === "pintrest" ? "default" : "secondary"}
//         size="xl"
//         onPress={() => onAnswer("pintrest")}
//       >
//         <Text>Pintrest</Text>
//       </Button>
//       <Button
//         variant={currentAnswer === "other" ? "default" : "secondary"}
//         size="xl"
//         onPress={() => onAnswer("other")}
//       >
//         <Text>Other</Text>
//       </Button>
//     </View>
//   </View>
// );

const AestheticStep = ({ onAnswer, currentAnswer = [] }) => {
  const toggle = (val) => {
    playHaptic("selection");
    onAnswer((prev = []) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };
  const isSelected = (val) => currentAnswer?.includes?.(val);

  const aestheticOptions = [
    { value: "minimalist", label: "Minimalist", emoji: "✨", color: "#E5E7EB" },
    { value: "vibrant", label: "Vibrant", emoji: "🌈", color: "#FBBF24" },
    { value: "moody", label: "Moody", emoji: "🌙", color: "#6366F1" },
    {
      value: "sophisticated",
      label: "Sophisticated",
      emoji: "💎",
      color: "#EC4899",
    },
  ];

  return (
    <View className="mx-auto w-[90%] gap-y-4">
      <View className="gap-y-4">
        <H2>What kind of look are you going for?</H2>
        <P>We'll edit photos the way you like</P>
      </View>
      <View className="gap-y-4">
        {aestheticOptions.map((option, index) => (
          <Animated.View
            key={option.value}
            entering={FadeInDown.duration(400).delay(index * 100)}
          >
            <Pressable
              onPress={() => toggle(option.value)}
              className={`
                rounded-2xl p-6 border-2
                ${isSelected(option.value)
                  ? "bg-primary/10 border-primary"
                  : "bg-card border-border"
                }
              `}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-x-4">
                  <View
                    className="w-14 h-14 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: isSelected(option.value)
                        ? option.color + "40"
                        : option.color + "20",
                    }}
                  >
                    <Text className="text-3xl">{option.emoji}</Text>
                  </View>
                  <View>
                    <Text
                      className={`text-xl font-bold ${isSelected(option.value)
                        ? "text-primary"
                        : "text-foreground"
                        }`}
                    >
                      {option.label}
                    </Text>
                  </View>
                </View>
                {isSelected(option.value) && (
                  <Animated.View
                    entering={FadeInRight.duration(200)}
                    exiting={FadeOutDown.duration(200)}
                  >
                    <View className="w-7 h-7 rounded-full bg-primary items-center justify-center">
                      <Text className="text-primary-foreground font-bold">
                        ✓
                      </Text>
                    </View>
                  </Animated.View>
                )}
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

// const SkinStep = ({ onAnswer, currentAnswer }) => (
//   <View className="mx-auto w-[90%] gap-y-4">
//     <View className="gap-y-4">
//       <H2>What's your skin tone?</H2>
//       <P></P>
//     </View>
//     <View className="gap-y-4">
//       <Button
//         variant={currentAnswer === "light" ? "default" : "secondary"}
//         size="xl"
//         onPress={() => onAnswer("light")}
//       >
//         <Text>Light</Text>
//       </Button>
//       <Button
//         variant={currentAnswer === "medium" ? "default" : "secondary"}
//         size="xl"
//         onPress={() => onAnswer("medium")}
//       >
//         <Text>Medium</Text>
//       </Button>
//       <Button
//         variant={currentAnswer === "dark" ? "default" : "secondary"}
//         size="xl"
//         onPress={() => onAnswer("dark")}
//       >
//         <Text>Dark</Text>
//       </Button>
//     </View>
//   </View>
// );

const Credibility = () => (
  <View className="flex-1 mx-auto w-[90%] gap-y-4 justify-center">
    <View className="gap-y-4">
      <H2>How natural do your enhanced photos appear?</H2>
      <P>Validated by top makeup artists for true‑to‑life results.</P>
    </View>
    <View className="flex flex-row">
      <CountUp
        className="font-bold text-7xl"
        from={60}
        to={98.5}
        decimals={1}
        duration={5000}
      />
      <Text className="font-bold text-7xl">%</Text>
    </View>
  </View>
);

const EVIDENCE_MESSAGE = {
  instagram: {
    header: "Ready for Instagram",
    text1: "Most users report their photos look natural and consistent.",
    text2: "In‑feed previews and Stories covers remain sharp.",
    icon: require("~/assets/icons/instagram.png"),
  },
  tiktok: {
    header: "Optimized for TikTok",
    text1: "Covers stay crisp on profile grids and For You previews.",
    text2: "Text overlays remain legible on small screens.",
    icon: require("~/assets/icons/tiktok.png"),
  },
  pinterest: {
    header: "Dialed in for Pinterest",
    text1: "Pins preserve color and texture without looking over‑processed.",
    text2: "Thumbnails look clean in multi‑pin boards.",
    icon: require("~/assets/icons/pinterest.png"),
  },
  other: {
    header: "Good to go",
    text1: "Exports stay sharp across most platforms.",
    text2: "Balanced tone keeps faces and details natural.",
    icon: require("~/assets/images/icon.png"),
  },
};

const Evidence = ({ allAnswers, currentIndex }) => {
  const platform_picked = allAnswers["platform"] || "other";
  const data = EVIDENCE_MESSAGE[platform_picked] || EVIDENCE_MESSAGE.other;

  return (
    <View className="flex-1 items-center justify-center w-[90%] mx-auto">
      <Animated.View
        entering={FadeInDown.duration(700).springify()}
        className="items-center mb-8 gap-y-2"
      >
        <H1 className="text-center text-4xl border-0 font-bold">Perfect Match! 🎉</H1>
        <P className="text-center text-lg text-muted-foreground w-full px-4">
          {data.header}
        </P>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200).duration(700).springify()}
        className="mb-10 w-full items-center"
      >
        <View className="w-40 h-40 bg-card rounded-[40px] items-center justify-center shadow-2xl border-2 border-border/50">
          <Image
            source={data.icon}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      <View className="w-full gap-y-4">
        <Animated.View entering={FadeInDown.delay(400).duration(600).springify()}>
          <View className="flex-row items-center bg-secondary/40 p-5 rounded-3xl border border-secondary/50">
            <View className="w-12 h-12 rounded-full bg-background items-center justify-center mr-4 shadow-sm">
              <Check size={24} color="#000" strokeWidth={3} />
            </View>
            <Text className="flex-1 font-medium text-foreground text-base leading-tight">
              {data.text1}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(550).duration(600).springify()}>
          <View className="flex-row items-center bg-secondary/40 p-5 rounded-3xl border border-secondary/50">
            <View className="w-12 h-12 rounded-full bg-background items-center justify-center mr-4 shadow-sm">
              <InfoIcon size={24} color="#000" strokeWidth={2.5} />
            </View>
            <Text className="flex-1 font-medium text-foreground text-base leading-tight">
              {data.text2}
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const Implication = () => (
  <View className="flex-1 justify-center mx-auto w-[90%] gap-y-4">
    <View className="gap-y-4">
      <H2>Why amazing photos matter?</H2>
    </View>
    <View className="flex flex-col gap-x-4 gap-y-4">
      {[
        "Up to 60% more likes",
        "Growing follower counts",
        "39% more likely to be featured in FY Section",
        "Boost your confidence",
      ].map((e, i) => (
        <Animated.View
          key={e}
          className="flex flex-row gap-x-4"
          entering={FadeInDown.duration(800).delay(i * 200)}
        >
          <InfoIcon color={"red"} />
          <Text className="font-semibold tracking-wide">{e}</Text>
        </Animated.View>
      ))}
    </View>
  </View>
);

const stepConfig = [
  {
    key: "hero",
    component: HeroScreen,
    autoAdvance: false,
    nextButton: true,
    backButton: false,
  },
  {
    key: "social",
    component: SocialProof,
    autoAdvance: false,
    nextButton: true,
    backButton: true,
  },
  {
    key: "goal",
    component: GoalStep,
    autoAdvance: false,
    nextButton: true,
    backButton: true,
  },
  // {
  //   key: "age",
  //   component: AgeStep,
  //   autoAdvance: true,
  //   nextButton: false,
  //   backButton: true,
  // },
  {
    key: "platform",
    component: PlatformStep,
    autoAdvance: true,
    nextButton: false,
    backButton: true,
  },
  {
    key: "evidence",
    component: Evidence,
    autoAdvance: true,
    nextButton: true,
    backButton: true,
  },
  {
    key: "aesthetic",
    component: AestheticStep,
    autoAdvance: false,
    nextButton: true,
    backButton: true,
  },
  {
    key: "skin",
    component: SkinStep,
    autoAdvance: false,
    nextButton: true,
    backButton: true,
  },
  {
    key: "credibility",
    component: Credibility,
    autoAdvance: false,
    nextButton: true,
    backButton: true,
  },

  {
    key: "implication",
    component: Implication,
    autoAdvance: false,
    nextButton: true,
    backButton: true,
  },
];

const SESSION_CAPTURED = new Set<string>();

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    gender: null,
    age: null,
    goals: null,
    experience: null,
    aesthetic: [],
  });
  const [slideDirection, setSlideDirection] = useState<"right" | "left">(
    "right"
  );

  const totalSteps = stepConfig.length;
  const currentStepConfig = stepConfig[currentStep];
  const currentStepKey = currentStepConfig.key;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const captured = useMemo(() => SESSION_CAPTURED, []);

  useEffect(() => {
    const key = stepConfig[currentStep]?.key;
    if (!key) return;

    const eventName = `Onboarding ${key} ${currentStep}`;
    if (captured.has(eventName)) return;

    try {
      console.log("Capturing", eventName);
      posthog.capture(eventName, { step: currentStep });
      captured.add(eventName);
    } catch { }
  }, [currentStep, stepConfig, captured]);

  const handleAnswer = (answerOrUpdater) => {
    playHaptic("selection");
    setAnswers((prev) => {
      const current = prev[currentStepKey];
      const nextValue =
        typeof answerOrUpdater === "function"
          ? answerOrUpdater(current)
          : answerOrUpdater;
      return { ...prev, [currentStepKey]: nextValue };
    });

    if (currentStepConfig.autoAdvance) {
      setTimeout(() => {
        if (isLastStep) {
          console.log("Onboarding complete:", {
            ...answers,
            [currentStepKey]:
              typeof answerOrUpdater === "function"
                ? answerOrUpdater(answers[currentStepKey])
                : answerOrUpdater,
          });
        } else {
          setCurrentStep((prev) => prev + 1);
        }
      }, 100);
    }
  };

  const handleNext = async () => {
    playHaptic("light");
    setSlideDirection("left");
    await new Promise((resolve) => setTimeout(resolve, 60));

    if (isLastStep) {
      console.log("Onboarding complete:", answers);
      router.replace("/(unauthenticated)/onboarding/Encouragement");
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    playHaptic("rigid");
    setSlideDirection("right");
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    } else {
      // router.replace("/(unauthenticated)");
      router.back();
    }
  };

  const renderCurrentStep = () => {
    const currentAnswer = answers[currentStepKey];
    const StepComponent = currentStepConfig.component;

    return (
      <StepComponent
        onAnswer={handleAnswer}
        currentAnswer={currentAnswer}
        allAnswers={answers}
        currentIndex={currentStepKey}
      />
    );
  };

  const val = answers[currentStepKey];
  const hasAnswer = Array.isArray(val) ? val.length > 0 : val !== null;
  const showNextButton = currentStepConfig.nextButton;

  const inAnim = (dir: "left" | "right") =>
    (dir === "left" ? SlideInRight : SlideInLeft)
      .duration(230)
      .springify()
      .damping(16)
      .stiffness(200)
      .mass(0.9);

  // const outAnim = (dir: "left" | "right") =>
  //   (dir === "left" ? SlideOutLeft : SlideOutRight)
  //     .springify()
  //     .damping(16)
  //     .stiffness(180)
  //     .mass(0.9);

  return (
    <View className="flex-1 justify-between bg-background">
      <Animated.View
        key={currentStep}
        className={"flex-1"}
        entering={inAnim(slideDirection)}
        // exiting={outAnim(slideDirection)}
        layout={Layout.springify().damping(18).stiffness(100).duration(400)}
      >
        <SafeAreaView className="flex-1">
          <View className="mx-auto w-[90%] pt-4">
            <View className="w-full flex-row justify-between items-center mb-4 mx-auto">
              <View className="flex-row items-center space-x-3">
                {currentStepConfig.backButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={handleBack}
                    className="p-2"
                  >
                    <Text>← Back</Text>
                  </Button>
                )}
              </View>
              {/* <View className="w-full bg-gray-200 rounded-full h-2">
              <View
                className="bg-primary h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View> */}
            </View>
          </View>
          <View className="flex-1">{renderCurrentStep()}</View>

          {showNextButton && (
            <View className="mx-auto w-[90%] pb-8">
              <Button
                size="xl"
                onPress={handleNext}
                disabled={!hasAnswer}
                variant={hasAnswer ? "default" : "secondary"}
                className="rounded-2xl"
              >
                <Text className="font-extrabold tracking-widest text-4xl">
                  {isLastStep ? "Complete" : "Next"}
                </Text>
              </Button>
            </View>
          )}

          {!showNextButton && <View className="pb-8" />}
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}
