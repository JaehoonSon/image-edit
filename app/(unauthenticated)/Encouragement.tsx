import { useState } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { TypeWriter } from "~/components/ui/type-writer";

const EncouragementMessage: { text: string; speed: number }[] = [
  {
    text: "Most people never end up achieving nothing due to lack of confidence.",
    speed: 40,
  },
  {
    text: "It's time for you to unveil the truth",
    speed: 50,
  },
];

export default function EncouragementScreen() {
  const [index, setIndex] = useState(0); // 0 → first message
  const [showButton, setShowButton] = useState(false);

  const handleEnd = () => {
    if (index < EncouragementMessage.length - 1) {
      // move to next message
      setTimeout(() => setIndex(index + 1), 2000);
    } else {
      // last message finished – reveal the button
      setTimeout(() => setShowButton(true), 1000);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <View className="flex-1 py-10 px-16 justify-between items-center w-full">
        {/* Center the typewriter */}
        <View className="flex-1 justify-center items-center">
          <TypeWriter
            key={index}
            text={EncouragementMessage[index].text}
            speed={EncouragementMessage[index].speed}
            onTypingEnd={handleEnd}
            className="font-semibold text-center text-2xl"
          />
        </View>

        {/* Show button only after both messages are done */}
        {showButton && (
          <Button className="rounded-full mb-10 w-full" size="xl">
            <Text className="font-semibold tracking-wider">
              Analyse my answers
            </Text>
          </Button>
        )}
      </View>
    </View>
  );
}
