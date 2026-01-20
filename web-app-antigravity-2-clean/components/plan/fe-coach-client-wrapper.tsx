"use client";

import { useState } from "react";
import { FeCoachChat } from "./fe-coach-chat";

interface FeCoachClientWrapperProps {
  tier: "starter" | "trial" | "plus" | "pro";
  creditsRemaining?: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function FeCoachClientWrapper({
  tier: initialTier,
  creditsRemaining: initialCredits
}: FeCoachClientWrapperProps) {
  const [creditsRemaining, setCreditsRemaining] = useState(initialCredits);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);

  const handleCoachMessage = async (message: string): Promise<string> => {
    try {
      const response = await fetch("/api/fe-coach/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversationHistory,
        }),
      });

      if (response.status === 403) {
        // Quota exceeded
        const data = await response.json();
        throw new Error(data.message || "You've reached your AI credit limit");
      }

      if (!response.ok) {
        throw new Error("Failed to get response from FE Coach");
      }

      const data = await response.json();

      // Update conversation history
      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: data.message },
      ]);

      // Update credits if Starter tier
      if (data.creditsRemaining !== null && data.creditsRemaining !== undefined) {
        setCreditsRemaining(data.creditsRemaining);
      }

      return data.message;
    } catch (error) {
      console.error("FE Coach error:", error);
      throw error;
    }
  };

  return (
    <FeCoachChat
      tier={initialTier}
      creditsRemaining={creditsRemaining}
      onSendMessage={handleCoachMessage}
    />
  );
}
