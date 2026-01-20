"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";

interface SpeechButtonProps {
    onTranscript: (text: string) => void;
    isListening: boolean;
    onListeningChange: (listening: boolean) => void;
}

export function SpeechButton({ onTranscript, isListening, onListeningChange }: SpeechButtonProps) {
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        // Check if browser supports Speech Recognition
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            setIsSupported(!!SpeechRecognition);
        }
    }, []);

    const handleClick = () => {
        if (!isSupported) return;

        if (isListening) {
            // Stop listening
            onListeningChange(false);
            return;
        }

        // Start listening
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            onListeningChange(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onTranscript(transcript);
            onListeningChange(false);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            onListeningChange(false);
        };

        recognition.onend = () => {
            onListeningChange(false);
        };

        recognition.start();
    };

    if (!isSupported) {
        return null; // Hide button if not supported
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`
        flex items-center gap-2 px-4 py-3 rounded-lg font-medium
        transition-all min-h-[44px]
        ${isListening
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
                }
      `}
        >
            {isListening ? (
                <>
                    <MicOff className="w-5 h-5" />
                    <span>Stop Recording</span>
                </>
            ) : (
                <>
                    <Mic className="w-5 h-5" />
                    <span>🎤 Tap to Speak</span>
                </>
            )}
        </button>
    );
}
