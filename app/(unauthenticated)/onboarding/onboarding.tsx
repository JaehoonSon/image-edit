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
import { H2, Muted, P } from "~/components/ui/typography";
import { playHaptic } from "~/lib/hapticSound";

const GenderStep = ({ onAnswer, currentAnswer }) => (
  <View className="mx-auto w-[90%] gap-y-4">
    <View className="gap-y-4">
      <H2>What's your gender?</H2>
      <P>This helps us to create a custom plan</P>
    </View>
    <View className="gap-y-4">
      <Button
        variant={currentAnswer === "male" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("male")}
      >
        <Text>Male</Text>
      </Button>
      <Button
        variant={currentAnswer === "female" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("female")}
      >
        <Text>Female</Text>
      </Button>
    </View>
  </View>
);

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

const GoalsStep = ({ onAnswer, currentAnswer }) => (
  <View className="mx-auto w-[90%] gap-y-4">
    <View className="gap-y-4">
      <H2>What's your main goal?</H2>
      <P>Select what you want to achieve</P>
    </View>
    <View className="gap-y-4">
      <Button
        variant={currentAnswer === "lose_weight" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("lose_weight")}
      >
        <Text>Lose Weight</Text>
      </Button>
      <Button
        variant={currentAnswer === "gain_muscle" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("gain_muscle")}
      >
        <Text>Gain Muscle</Text>
      </Button>
      <Button
        variant={currentAnswer === "stay_healthy" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("stay_healthy")}
      >
        <Text>Stay Healthy</Text>
      </Button>
    </View>
  </View>
);

const ExperienceStep = ({ onAnswer, currentAnswer }) => (
  <View className="mx-auto w-[90%] gap-y-4">
    <View className="gap-y-4">
      <H2>What's your fitness experience?</H2>
      <P>This helps us adjust the difficulty</P>
    </View>
    <View className="gap-y-4">
      <Button
        variant={currentAnswer === "beginner" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("beginner")}
      >
        <Text>Beginner</Text>
      </Button>
      <Button
        variant={currentAnswer === "intermediate" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("intermediate")}
      >
        <Text>Intermediate</Text>
      </Button>
      <Button
        variant={currentAnswer === "advanced" ? "default" : "secondary"}
        size="xl"
        onPress={() => onAnswer("advanced")}
      >
        <Text>Advanced</Text>
      </Button>
    </View>
  </View>
);

const Credibility = () => (
  <View className="mx-auto w-[90%] gap-y-4">
    <View className="gap-y-4">
      <H2>How accurate is our tool?</H2>
      <P>We use key metrics and top scientific research to back our data</P>
    </View>
    {/* <TypeWriter text="98.5%" /> */}
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
    {/* <TypeWriter text="98.5%" /> */}
    <View className="flex flex-col">
      <LayoutAnimationConfig>
        <Animated.View
          key={"1"}
          entering={FadeInDown.duration(600)}
          // exiting={FadeOutDown}
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
          // exiting={FadeOutDown}
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
      <H2>What this means for you?</H2>
    </View>
    {/* <TypeWriter text="98.5%" /> */}
    <View className="flex flex-col gap-x-4 gap-y-4">
      {[
        "40% fewer opportunities",
        "Ignored in rooms that matter",
        "50% less likely to be a CEO",
      ].map((e, i) => (
        <Animated.View
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

// Step configuration with control options
const stepConfig = [
  {
    key: "gender",
    component: GenderStep,
    autoAdvance: true,
    nextButton: false,
    backButton: true,
  },
  {
    key: "age",
    component: AgeStep,
    autoAdvance: true,
    nextButton: false,
    backButton: true,
  },
  {
    key: "goals",
    component: GoalsStep,
    autoAdvance: true,
    nextButton: false,
    backButton: true,
  },
  {
    key: "experience",
    component: ExperienceStep,
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
  {
    key: "evidence",
    component: Evidence,
    autoAdvance: true,
    nextButton: true,
    backButton: true,
  },
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
  });

  const totalSteps = stepConfig.length;
  const currentStepConfig = stepConfig[currentStep];
  const currentStepKey = currentStepConfig.key;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleAnswer = (answer) => {
    playHaptic("selection");
    setAnswers((prev) => ({
      ...prev,
      [currentStepKey]: answer,
    }));

    // Auto-advance to next step if configured with delay
    if (currentStepConfig.autoAdvance) {
      setTimeout(() => {
        if (isLastStep) {
          // Handle completion
          console.log("Onboarding complete:", {
            ...answers,
            [currentStepKey]: answer,
          });
          // Navigate to next screen or whatever you need
        } else {
          setCurrentStep((prev) => prev + 1);
        }
      }, 100); // 1 second delay
    }
  };

  const handleNext = () => {
    playHaptic("light");
    if (isLastStep) {
      // Handle completion
      console.log("Onboarding complete:", answers);
      router.push("/(unauthenticated)/Encouragement");
      // Navigate to next screen or whatever you need
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    playHaptic("rigid");
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const renderCurrentStep = () => {
    const currentAnswer = answers[currentStepKey];
    const StepComponent = currentStepConfig.component;

    return (
      <StepComponent onAnswer={handleAnswer} currentAnswer={currentAnswer} />
    );
  };

  const hasAnswer = answers[currentStepKey] !== null;
  const showNextButton = currentStepConfig.nextButton;

  return (
    <View className="flex-1 justify-between">
      {/* Progress indicator with back button */}
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
          <Text className="text-sm text-gray-500">{Math.round(progress)}%</Text>
        </View>
        <View className="w-full bg-gray-200 rounded-full h-2">
          <View
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      {/* Current step content */}
      <View className="flex-1 justify-center">{renderCurrentStep()}</View>

      {/* Next button (if configured) */}
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

      {/* Bottom spacing (if no next button) */}
      {!showNextButton && <View className="pb-8" />}
    </View>
  );
}
