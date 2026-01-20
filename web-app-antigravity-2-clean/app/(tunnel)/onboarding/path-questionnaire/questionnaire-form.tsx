"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionCard } from "@/components/questionnaire/question-card";
import { SpeechButton } from "@/components/questionnaire/speech-button";
import { createClient } from "@/lib/supabase/browser";

interface PathQuestionnaireFormProps {
    path: "professional" | "entrepreneur";
    userId: string;
}

export default function PathQuestionnaireForm({ path, userId }: PathQuestionnaireFormProps) {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [isListening, setIsListening] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Entrepreneur answers
    const [businessStage, setBusinessStage] = useState("");
    const [businessStory, setBusinessStory] = useState("");
    const [entrepreneurChallenge, setEntrepreneurChallenge] = useState("");

    // Professional answers
    const [employmentStatus, setEmploymentStatus] = useState("");
    const [interestsSkills, setInterestsSkills] = useState("");
    const [workConcern, setWorkConcern] = useState("");

    const [usedSpeech, setUsedSpeech] = useState(false);

    const handleNext = () => {
        if (currentQuestion < 3) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSaving(true);

        try {
            const supabase = createClient();

            // Count words
            const allText = path === "entrepreneur"
                ? `${businessStory} ${entrepreneurChallenge}`
                : `${interestsSkills} ${workConcern}`;
            const wordCount = allText.trim().split(/\s+/).length;

            // Save to database
            const { error } = await supabase
                .from("path_questionnaire_answers")
                .upsert({
                    user_id: userId,
                    path,
                    // Entrepreneur
                    business_stage: path === "entrepreneur" ? businessStage : null,
                    business_story: path === "entrepreneur" ? businessStory : null,
                    entrepreneur_challenge: path === "entrepreneur" ? entrepreneurChallenge : null,
                    // Professional
                    employment_status: path === "professional" ? employmentStatus : null,
                    interests_skills: path === "professional" ? interestsSkills : null,
                    work_concern: path === "professional" ? workConcern : null,
                    // Meta
                    word_count: wordCount,
                    used_speech_to_text: usedSpeech,
                });

            if (error) throw error;

            // Update onboarding step to 3 (generating)
            await supabase
                .from("profiles")
                .update({ onboarding_step: 3 })
                .eq("user_id", userId);

            // Redirect to generating
            router.push("/onboarding/generating");

        } catch (err) {
            console.error("Error saving questionnaire:", err);
            alert("Failed to save your answers. Please try again.");
            setIsSaving(false);
        }
    };

    const handleTranscript = (text: string, field: "story" | "challenge" | "interests" | "concern") => {
        setUsedSpeech(true);

        if (field === "story") {
            setBusinessStory(prev => prev + (prev ? " " : "") + text);
        } else if (field === "challenge") {
            setEntrepreneurChallenge(prev => prev + (prev ? " " : "") + text);
        } else if (field === "interests") {
            setInterestsSkills(prev => prev + (prev ? " " : "") + text);
        } else if (field === "concern") {
            setWorkConcern(prev => prev + (prev ? " " : "") + text);
        }
    };

    // Entrepreneur Questions
    if (path === "entrepreneur") {
        if (currentQuestion === 1) {
            return (
                <QuestionCard
                    questionNumber={1}
                    totalQuestions={3}
                    title="Where are you on your entrepreneurial journey?"
                    subtitle="This helps us give you the right guidance for your stage."
                >
                    <div className="space-y-3">
                        {[
                            { value: "idea", label: "I have a rough idea but haven't validated it yet" },
                            { value: "pre-launch", label: "I'm actively working on a product/service (pre-launch)" },
                            { value: "early", label: "I've launched and have my first customers (under $1K/month)" },
                            { value: "consistent", label: "I'm generating consistent revenue ($1K-10K/month)" },
                            { value: "scaling", label: "I'm scaling an established business (over $10K/month)" },
                            { value: "exploring", label: "I want to start a business but don't know what to do" },
                        ].map((option) => (
                            <label
                                key={option.value}
                                className={`
                  flex items-start p-4 rounded-lg border-2 cursor-pointer
                  transition-all min-h-[44px]
                  ${businessStage === option.value
                                        ? "border-purple-600 bg-purple-50"
                                        : "border-gray-200 hover:border-purple-300 active:scale-[0.99]"
                                    }
                `}
                            >
                                <input
                                    type="radio"
                                    name="businessStage"
                                    value={option.value}
                                    checked={businessStage === option.value}
                                    onChange={(e) => setBusinessStage(e.target.value)}
                                    className="mt-1 mr-3"
                                />
                                <span className="text-gray-900">{option.label}</span>
                            </label>
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={!businessStage}
                        className="w-full mt-6 h-12 bg-purple-600 text-white rounded-lg font-semibold
              disabled:bg-gray-300 disabled:cursor-not-allowed
              hover:bg-purple-700 active:scale-[0.98] transition-all"
                    >
                        Next
                    </button>
                </QuestionCard>
            );
        }

        if (currentQuestion === 2) {
            return (
                <QuestionCard
                    questionNumber={2}
                    totalQuestions={3}
                    title="Tell us about your business idea or current business."
                    subtitle="Give us the full story. The more you share, the better we can help."
                >
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            • What's your business about?<br />
                            • Who are your customers?<br />
                            • What problem does it solve?<br />
                            • Where are you stuck? What's working?
                        </p>

                        <textarea
                            value={businessStory}
                            onChange={(e) => setBusinessStory(e.target.value)}
                            placeholder="Type or speak your story..."
                            rows={6}
                            className="w-full p-4 border-2 border-gray-300 rounded-lg
                focus:border-purple-600 focus:ring-2 focus:ring-purple-200
                text-base resize-none"
                        />

                        <SpeechButton
                            onTranscript={(text) => handleTranscript(text, "story")}
                            isListening={isListening}
                            onListeningChange={setIsListening}
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setCurrentQuestion(1)}
                            className="flex-1 h-12 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold
                hover:bg-gray-50 active:scale-[0.98] transition-all"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!businessStory.trim() || businessStory.trim().length < 20}
                            className="flex-1 h-12 bg-purple-600 text-white rounded-lg font-semibold
                disabled:bg-gray-300 disabled:cursor-not-allowed
                hover:bg-purple-700 active:scale-[0.98] transition-all"
                        >
                            Next
                        </button>
                    </div>
                </QuestionCard>
            );
        }

        if (currentQuestion === 3) {
            return (
                <QuestionCard
                    questionNumber={3}
                    totalQuestions={3}
                    title="What's your biggest challenge right now?"
                    subtitle="Be specific! The more detail, the better."
                >
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            Examples:<br />
                            • "I need $5K to buy equipment but have bad credit"<br />
                            • "I don't know how to find customers in my area"<br />
                            • "I'm working 60 hours/week and can't scale"
                        </p>

                        <textarea
                            value={entrepreneurChallenge}
                            onChange={(e) => setEntrepreneurChallenge(e.target.value)}
                            placeholder="Type or speak your biggest challenge..."
                            rows={6}
                            className="w-full p-4 border-2 border-gray-300 rounded-lg
                focus:border-purple-600 focus:ring-2 focus:ring-purple-200
                text-base resize-none"
                        />

                        <SpeechButton
                            onTranscript={(text) => handleTranscript(text, "challenge")}
                            isListening={isListening}
                            onListeningChange={setIsListening}
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setCurrentQuestion(2)}
                            className="flex-1 h-12 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold
                hover:bg-gray-50 active:scale-[0.98] transition-all"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!entrepreneurChallenge.trim() || isSaving}
                            className="flex-1 h-12 bg-purple-600 text-white rounded-lg font-semibold
                disabled:bg-gray-300 disabled:cursor-not-allowed
                hover:bg-purple-700 active:scale-[0.98] transition-all"
                        >
                            {isSaving ? "Saving..." : "Complete"}
                        </button>
                    </div>
                </QuestionCard>
            );
        }
    }

    // Professional Questions
    if (path === "professional") {
        if (currentQuestion === 1) {
            return (
                <QuestionCard
                    questionNumber={1}
                    totalQuestions={3}
                    title="What's your current employment situation?"
                    subtitle="This helps us match you with the right opportunities."
                >
                    <div className="space-y-3">
                        {[
                            { value: "unemployed-first", label: "Unemployed - Looking for my first job after release" },
                            { value: "unemployed-experienced", label: "Unemployed - Have work history, looking for new opportunity" },
                            { value: "part-time", label: "Working part-time - Want full-time work" },
                            { value: "full-time-better", label: "Working full-time - Want a better job (more pay/benefits)" },
                            { value: "career-switch", label: "Working full-time - Want to switch careers completely" },
                            { value: "never-worked", label: "Want to work but have never held a traditional job" },
                        ].map((option) => (
                            <label
                                key={option.value}
                                className={`
                  flex items-start p-4 rounded-lg border-2 cursor-pointer
                  transition-all min-h-[44px]
                  ${employmentStatus === option.value
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-200 hover:border-blue-300 active:scale-[0.99]"
                                    }
                `}
                            >
                                <input
                                    type="radio"
                                    name="employmentStatus"
                                    value={option.value}
                                    checked={employmentStatus === option.value}
                                    onChange={(e) => setEmploymentStatus(e.target.value)}
                                    className="mt-1 mr-3"
                                />
                                <span className="text-gray-900">{option.label}</span>
                            </label>
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={!employmentStatus}
                        className="w-full mt-6 h-12 bg-blue-600 text-white rounded-lg font-semibold
              disabled:bg-gray-300 disabled:cursor-not-allowed
              hover:bg-blue-700 active:scale-[0.98] transition-all"
                    >
                        Next
                    </button>
                </QuestionCard>
            );
        }

        if (currentQuestion === 2) {
            return (
                <QuestionCard
                    questionNumber={2}
                    totalQuestions={3}
                    title="What kind of work interests you?"
                    subtitle="Tell us about your skills, interests, and what you enjoy."
                >
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            • Any past jobs you liked?<br />
                            • Skills you have (cooking, fixing things, talking to people)?<br />
                            • Hobbies or things you're naturally good at?<br />
                            • Industries that interest you?
                        </p>

                        <textarea
                            value={interestsSkills}
                            onChange={(e) => setInterestsSkills(e.target.value)}
                            placeholder="Type or speak about what interests you..."
                            rows={6}
                            className="w-full p-4 border-2 border-gray-300 rounded-lg
                focus:border-blue-600 focus:ring-2 focus:ring-blue-200
                text-base resize-none"
                        />

                        <SpeechButton
                            onTranscript={(text) => handleTranscript(text, "interests")}
                            isListening={isListening}
                            onListeningChange={setIsListening}
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setCurrentQuestion(1)}
                            className="flex-1 h-12 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold
                hover:bg-gray-50 active:scale-[0.98] transition-all"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!interestsSkills.trim() || interestsSkills.trim().length < 20}
                            className="flex-1 h-12 bg-blue-600 text-white rounded-lg font-semibold
                disabled:bg-gray-300 disabled:cursor-not-allowed
                hover:bg-blue-700 active:scale-[0.98] transition-all"
                        >
                            Next
                        </button>
                    </div>
                </QuestionCard>
            );
        }

        if (currentQuestion === 3) {
            return (
                <QuestionCard
                    questionNumber={3}
                    totalQuestions={3}
                    title="What's your biggest concern about work right now?"
                    subtitle="Be honest. What's holding you back or worrying you most?"
                >
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            Examples:<br />
                            • "Employers always ghost me when they see my record"<br />
                            • "I don't have transportation to get to most jobs"<br />
                            • "I'm confident I can do the work but bomb every interview"
                        </p>

                        <textarea
                            value={workConcern}
                            onChange={(e) => setWorkConcern(e.target.value)}
                            placeholder="Type or speak your biggest concern..."
                            rows={6}
                            className="w-full p-4 border-2 border-gray-300 rounded-lg
                focus:border-blue-600 focus:ring-2 focus:ring-blue-200
                text-base resize-none"
                        />

                        <SpeechButton
                            onTranscript={(text) => handleTranscript(text, "concern")}
                            isListening={isListening}
                            onListeningChange={setIsListening}
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setCurrentQuestion(2)}
                            className="flex-1 h-12 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold
                hover:bg-gray-50 active:scale-[0.98] transition-all"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!workConcern.trim() || isSaving}
                            className="flex-1 h-12 bg-blue-600 text-white rounded-lg font-semibold
                disabled:bg-gray-300 disabled:cursor-not-allowed
                hover:bg-blue-700 active:scale-[0.98] transition-all"
                        >
                            {isSaving ? "Saving..." : "Complete"}
                        </button>
                    </div>
                </QuestionCard>
            );
        }
    }

    return null;
}
