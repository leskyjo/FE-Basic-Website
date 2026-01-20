"use client";

import { ReactNode } from "react";

interface QuestionCardProps {
    questionNumber: number;
    totalQuestions: number;
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export function QuestionCard({
    questionNumber,
    totalQuestions,
    title,
    subtitle,
    children
}: QuestionCardProps) {
    const progress = (questionNumber / totalQuestions) * 100;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
            {/* Progress Bar */}
            <div className="w-full max-w-3xl mx-auto mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                        Question {questionNumber} of {totalQuestions}
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                        {Math.round(progress)}%
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        {title}
                    </h2>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className="text-base md:text-lg text-gray-600 mb-6">
                            {subtitle}
                        </p>
                    )}

                    {/* Question Content */}
                    <div className="space-y-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
