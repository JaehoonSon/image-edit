import { router } from "expo-router";
import { Bold, InfoIcon } from "lucide-react-native";
import { useState } from "react";
import { Image, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  LayoutAnimationConfig,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { CountUp } from "~/components/ui/count-up";
import { Text } from "~/components/ui/text";
import { Toggle, ToggleIcon } from "~/components/ui/toggle";
import { TypeWriter } from "~/components/ui/type-writer";
import { H2, H3, Muted, P } from "~/components/ui/typography";
import { playHaptic } from "~/lib/hapticSound";

const GoalStep = ({ onAnswer, currentAnswer = [] }) => {
  const toggle = (val) => {
    onAnswer((prev = []) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };
  const isSelected = (val) => currentAnswer?.includes?.(val);
  return (
    <View className="mx-auto w-[90%] gap-y-4">
      <View className="gap-y-4">
        <H2>How do you want to use the app?</H2>
        <P>Select all of the options that apply to you</P>
      </View>
      <View className="gap-y-4">
        <Button
          variant={isSelected("touch") ? "default" : "secondary"}
          size="xl"
          onPress={() => toggle("touch")}
        >
          <Text>Touch up my selfies for Instagram</Text>
        </Button>
        <Button
          variant={isSelected("experiment") ? "default" : "secondary"}
          size="xl"
          onPress={() => toggle("experiment")}
        >
          <Text>Experiment with different looks</Text>
        </Button>
        <Button
          variant={isSelected("smooth") ? "default" : "secondary"}
          size="xl"
          onPress={() => toggle("smooth")}
        >
          <Text>Smooth skin and brighten eye</Text>
        </Button>
        <Button
          variant={isSelected("customize") ? "default" : "secondary"}
          size="xl"
          onPress={() => toggle("customize")}
        >
          <Text>Customize facial features</Text>
        </Button>
      </View>
    </View>
  );
};

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

const PlatformStep = ({ onAnswer, currentAnswer }) => (
  <View className="mx-auto w-[90%] gap-y-4">
    <View className="gap-y-4">
      <H2>Where do you post the most?</H2>
      <P>Select where you want to optimize it for</P>
    </View>
    <View className="gap-y-4">
      <Button
        variant={currentAnswer === "instagram" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("instagram")}
      >
        <Text>Instagram</Text>
      </Button>
      <Button
        variant={currentAnswer === "tiktok" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("tiktok")}
      >
        <Text>TikTok</Text>
      </Button>
      <Button
        variant={currentAnswer === "pintrest" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("pintrest")}
      >
        <Text>Pintrest</Text>
      </Button>
      <Button
        variant={currentAnswer === "other" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("other")}
      >
        <Text>Other</Text>
      </Button>
    </View>
  </View>
);

const AestheticStep = ({ onAnswer, currentAnswer = [] }) => {
  const toggle = (val) => {
    onAnswer((prev = []) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };
  const isSelected = (val) => currentAnswer?.includes?.(val);
  return (
    <View className="mx-auto w-[90%] gap-y-4">
      <View className="gap-y-4">
        <H3>What kind of look you're going for?</H3>
        <P>We'll edit photos the way you like</P>
      </View>
      <View className="gap-y-4">
        <Button
          variant={isSelected("minimalist") ? "default" : "secondary"}
          size="xl"
          onPress={() => toggle("minimalist")}
        >
          <Text>Minimalist</Text>
        </Button>
        <Button
          variant={isSelected("vibrant") ? "default" : "secondary"}
          size="xl"
          onPress={() => toggle("vibrant")}
        >
          <Text>Vibrant</Text>
        </Button>
        <Button
          variant={isSelected("moody") ? "default" : "secondary"}
          size="xl"
          onPress={() => toggle("moody")}
        >
          <Text>Moody</Text>
        </Button>
        <Button
          variant={isSelected("sophisticated") ? "default" : "secondary"}
          size="xl"
          onPress={() => toggle("sophisticated")}
        >
          <Text>Sophisticated</Text>
        </Button>
      </View>
    </View>
  );
};

const SkinStep = ({ onAnswer, currentAnswer }) => (
  <View className="mx-auto w-[90%] gap-y-4">
    <View className="gap-y-4">
      <H2>What's your skin tone?</H2>
      <P></P>
    </View>
    <View className="gap-y-4">
      <Button
        variant={currentAnswer === "light" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("light")}
      >
        <Text>Light</Text>
      </Button>
      <Button
        variant={currentAnswer === "medium" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("medium")}
      >
        <Text>Medium</Text>
      </Button>
      <Button
        variant={currentAnswer === "dark" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("dark")}
      >
        <Text>Dark</Text>
      </Button>
    </View>
  </View>
);

const Credibility = () => (
  <View className="mx-auto w-[90%] gap-y-4">
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

const Evidence = () => (
  <View className="mx-auto w-[90%] gap-y-4">
    <View className="gap-y-1">
      <H2 className="border-0">Backed by Experts.</H2>
      <H2 className="border-0">Carefully Made For You</H2>
    </View>
    <View className="flex flex-col">
      <LayoutAnimationConfig>
        <Animated.View
          key={"1"}
          entering={FadeInDown.duration(600)}
          className="items-center mb-3"
        >
          <Card className="w-full shadow-none">
            <CardHeader>
              <View className="flex flex-row items-center">
                <View className="h-16 w-16 bg-white rounded-full overflow-hidden">
                  <Image
                    source={require("~/assets/onboarding/harvard_logo.png")}
                    className="w-16 h-16"
                    resizeMode="contain"
                  />
                </View>
                <Text className="flex-1 ml-3">
                  "Most people will end up achieving this and this"
                </Text>
              </View>
            </CardHeader>

            <CardFooter className="bg-secondary pt-3 pb-3">
              <View>
                <Muted>Research done in Harvard in 2025</Muted>
              </View>
            </CardFooter>
          </Card>
        </Animated.View>

        <Animated.View
          key={"2"}
          entering={FadeInDown.duration(700)}
          className="items-center"
        >
          <Card className="w-full shadow-none">
            <CardHeader>
              <View className="flex flex-row items-center">
                <View className="h-16 w-16 bg-white rounded-full overflow-hidden">
                  <Image
                    source={require("~/assets/onboarding/harvard_logo.png")}
                    className="w-16 h-16"
                    resizeMode="contain"
                  />
                </View>
                <Text className="flex-1 ml-3">
                  "Most people will end up achieving this and this"
                </Text>
              </View>
            </CardHeader>

            <CardFooter className="bg-secondary pt-3 pb-3">
              <View>
                <Muted>Research done in Harvard in 2025</Muted>
              </View>
            </CardFooter>
          </Card>
        </Animated.View>
      </LayoutAnimationConfig>
    </View>
  </View>
);

const Implication = () => (
  <View className="mx-auto w-[90%] gap-y-4">
    <View className="gap-y-4">
      <H2>Why amazing photos matter?</H2>
    </View>
    <View className="flex flex-col gap-x-4 gap-y-4">
      {[
        "Up to 60% more likes",
        "Growing follower counts",
        "39% more likely to be featured in Explore Section",
        "Boost your confidence",
      ].map((e, i) => (
        <Animated.View
          key={e}
          className="flex flex-row gap-x-4"
          entering={FadeInDown.duration(800).delay(i * 200)}
        >
          <InfoIcon />
          <Text>{e}</Text>
        </Animated.View>
      ))}
    </View>
  </View>
);

const stepConfig = [
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
    key: "aesthetic",
    component: AestheticStep,
    autoAdvance: false,
    nextButton: true,
    backButton: true,
  },
  {
    key: "skin",
    component: SkinStep,
    autoAdvance: true,
    nextButton: false,
    backButton: true,
  },
  {
    key: "credibility",
    component: Credibility,
    autoAdvance: true,
    nextButton: true,
    backButton: true,
  },
  // {
  //   key: "evidence",
  //   component: Evidence,
  //   autoAdvance: true,
  //   nextButton: true,
  //   backButton: true,
  // },
  {
    key: "implication",
    component: Implication,
    autoAdvance: true,
    nextButton: true,
    backButton: true,
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    gender: null,
    age: null,
    goals: null,
    experience: null,
    aesthetic: [],
  });

  const totalSteps = stepConfig.length;
  const currentStepConfig = stepConfig[currentStep];
  const currentStepKey = currentStepConfig.key;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

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

  const handleNext = () => {
    playHaptic("light");
    if (isLastStep) {
      console.log("Onboarding complete:", answers);
      router.replace("/(unauthenticated)/onboarding/Encouragement");
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    playHaptic("rigid");
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.replace("/(unauthenticated)");
    }
  };

  const renderCurrentStep = () => {
    const currentAnswer = answers[currentStepKey];
    const StepComponent = currentStepConfig.component;

    return (
      <StepComponent onAnswer={handleAnswer} currentAnswer={currentAnswer} />
    );
  };

  const val = answers[currentStepKey];
  const hasAnswer = Array.isArray(val) ? val.length > 0 : val !== null;
  const showNextButton = currentStepConfig.nextButton;

  return (
    <View className="flex-1 justify-between">
      <SafeAreaView className="flex-1">
        <View className="mx-auto w-[90%] pt-4">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-x-3">
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
              <Text className="text-sm text-gray-500">
                Step {currentStep + 1} of {totalSteps}
              </Text>
            </View>
            <Text className="text-sm text-gray-500">
              {Math.round(progress)}%
            </Text>
          </View>
          <View className="w-full bg-gray-200 rounded-full h-2">
            <View
              className="bg-primary h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        <View className="flex-1 justify-center">{renderCurrentStep()}</View>

        {showNextButton && (
          <View className="mx-auto w-[90%] pb-8">
            <Button
              size="xl"
              onPress={handleNext}
              disabled={!hasAnswer}
              variant={hasAnswer ? "default" : "secondary"}
            >
              <Text>{isLastStep ? "Complete" : "Next"}</Text>
            </Button>
          </View>
        )}

        {!showNextButton && <View className="pb-8" />}
      </SafeAreaView>
    </View>
  );
}
