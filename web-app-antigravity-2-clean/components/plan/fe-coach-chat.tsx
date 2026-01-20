"use client";

import { useState, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface FeCoachChatProps {
  tier: "starter" | "trial" | "plus" | "pro";
  creditsRemaining?: number;
  onSendMessage: (message: string) => Promise<string>;
}

export function FeCoachChat({ tier, creditsRemaining, onSendMessage }: FeCoachChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSend = tier === "starter" ? (creditsRemaining ?? 0) > 0 : true;

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [quotaExceededMessage, setQuotaExceededMessage] = useState("");

  // Listen for pre-fill events from strength cards
  useEffect(() => {
    const handlePrefill = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>;
      if (customEvent.detail?.message) {
        setInput(customEvent.detail.message);
      }
    };

    window.addEventListener('fe-coach-prefill', handlePrefill);
    return () => window.removeEventListener('fe-coach-prefill', handlePrefill);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !canSend || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await onSendMessage(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setShowUpgradeModal(false); // Reset if previously shown
    } catch (error) {
      // Check if quota exceeded
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      if (errorMessage.includes("credit limit") || errorMessage.includes("QUOTA_EXCEEDED")) {
        setQuotaExceededMessage(errorMessage);
        setShowUpgradeModal(true);
        // Remove the user message we just added since it failed
        setMessages((prev) => prev.slice(0, -1));
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      data-fe-coach
      className="glass-strong rounded-2xl border border-cyber-red/30 shadow-glow-red overflow-hidden"
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-cyber-black-light to-cyber-black-lighter p-4 border-b border-cyber-red/20">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-red/5 to-transparent animate-pulse" />

        <div className="relative flex items-center gap-3">
          {/* AI Icon with glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-cyber-red rounded-full blur-lg opacity-60 animate-pulse" />
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyber-red to-cyber-red-dark flex items-center justify-center border border-cyber-red shadow-glow-red">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white glow-text-red">
              FE Coach
            </h3>
            <p className="text-xs text-cyber-text-dim">
              Your AI Life Plan Guide
            </p>
          </div>

          {/* Credits badge (Starter only) */}
          {tier === "starter" && (
            <div className="glass rounded-lg px-3 py-1 border border-cyber-red/30">
              <p className="text-xs text-cyber-text-dim">Credits</p>
              <p className="text-sm font-bold text-cyber-red">
                {creditsRemaining ?? 0}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4 bg-cyber-black/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-cyber-red/10 flex items-center justify-center border border-cyber-red/20">
              <Sparkles className="w-8 h-8 text-cyber-red" />
            </div>
            <div>
              <p className="text-cyber-text font-medium">
                Ask FE Coach Anything
              </p>
              <p className="text-cyber-text-dim text-sm mt-1">
                Get personalized guidance about your Life Plan
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-cyber-red/20 border border-cyber-red/40 text-white"
                    : "glass border border-cyber-red/20 text-cyber-text"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass border border-cyber-red/20 rounded-2xl px-4 py-3">
              <div className="flex gap-2">
                <div
                  className="w-2 h-2 bg-cyber-red rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-cyber-red rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-cyber-red rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-cyber-black-lighter border-t border-cyber-red/20">
        {showUpgradeModal ? (
          <div className="glass-strong rounded-xl p-6 border border-cyber-red/30 text-center space-y-4">
            <h3 className="text-lg font-bold text-white">
              You&apos;ve used all your AI credits this week
            </h3>
            <p className="text-sm text-cyber-text">
              {quotaExceededMessage || "Upgrade to Trial, Plus, or Pro for unlimited FE Coach access"}
            </p>
            <div className="space-y-2">
              <p className="text-xs text-cyber-text-dim">
                Plus Tier ($15/mo, 7-day trial):
              </p>
              <ul className="text-xs text-cyber-text-dim space-y-1">
                <li>✅ Unlimited FE Coach access</li>
                <li>✅ 4 Life Plan regenerations/month</li>
                <li>✅ 15 Application Assists/month</li>
                <li>✅ 5 Resume generations/month</li>
              </ul>
            </div>
            <button
              onClick={() => window.location.href = "/pricing"}
              className="cyber-button w-full"
            >
              Start 7-Day Trial
            </button>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="text-cyber-text-dim text-sm hover:text-cyber-text transition-colors"
            >
              Close
            </button>
          </div>
        ) : canSend ? (
          <div className="flex gap-2">
            <input
              data-fe-coach-input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about your plan..."
              className="flex-1 bg-cyber-black border border-cyber-red/30 rounded-xl px-4 py-3
                         text-cyber-text placeholder-cyber-text-dim
                         focus:outline-none focus:border-cyber-red focus:shadow-glow-red
                         transition-all duration-300"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="cyber-button !px-4 !py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="glass-strong rounded-xl p-4 border border-cyber-red/30 text-center">
            <p className="text-cyber-text-dim text-sm mb-2">
              You&apos;re out of AI credits
            </p>
            <button
              onClick={() => window.location.href = "/pricing"}
              className="cyber-button text-sm"
            >
              Upgrade to Keep Chatting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
