// src/Index.tsx
import React, { useState } from 'react';
import ChatInterface, { Message } from '@/components/ChatInterface';
import UnifiedInterface from '@/components/UnifiedInterface';
import Particles from '@/components/Particles';
import DreamTransition from '@/components/DreamTransition';
import AchievementPopup from '@/components/AchievementPopup';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import useTherapistAPI from '@/hooks/useTherapistAPI';

// Define types for emotion, memory, achievement, etc.
type Emotion = 'joy' | 'wonder' | 'reflection' | 'curiosity';

interface Memory {
  id: string;
  title: string;
  description: string;
  emotion: Emotion;
  relatedMessages: string[];
  timestamp: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'award' | 'star' | 'heart' | 'book';
  unlocked: boolean;
}

interface EmotionCount {
  emotion: Emotion;
  count: number;
}

interface EmotionTrend {
  time: string;
  emotion: Emotion;
}

// Initial state examples
const initialMessages: Message[] = [
  {
    id: '1',
    text: "Welcome to MindfulReflect. How are you feeling today?",
    sender: 'companion',
    timestamp: new Date(),
  },
];

const initialMemories: Memory[] = [
  {
    id: 'm1',
    title: 'First Session',
    description: 'Beginning your journey of self-reflection and emotional growth.',
    emotion: 'wonder',
    relatedMessages: ['1'],
    timestamp: new Date(),
  },
];

const initialAchievements: Achievement[] = [
  {
    id: 'a1',
    title: 'First Steps',
    description: 'Begin your journey of self-reflection',
    icon: 'star',
    unlocked: true,
  },
  {
    id: 'a2',
    title: 'Emotional Explorer',
    description: 'Identify and acknowledge 3 different emotions',
    icon: 'heart',
    unlocked: false,
  },
  {
    id: 'a3',
    title: 'Growth Mindset',
    description: 'Complete 5 reflection sessions',
    icon: 'award',
    unlocked: false,
  },
  {
    id: 'a4',
    title: 'Journal Keeper',
    description: 'Create 3 personal insights',
    icon: 'book',
    unlocked: false,
  },
];

// A simple sentiment analyzer (customize as needed)
const analyzeSentiment = (text: string): Emotion => {
  const textLower = text.toLowerCase();
  if (textLower.includes('happy') || textLower.includes('joy')) return 'joy';
  if (textLower.includes('wonder')) return 'wonder';
  if (textLower.includes('think') || textLower.includes('reflect')) return 'reflection';
  return 'curiosity';
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [sessionProgress, setSessionProgress] = useState(10);
  const [reflectionStreak, setReflectionStreak] = useState(1);
  const [insightsCount, setInsightsCount] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState<string | null>(null);

  // Emotion tracking states
  const [emotionCounts, setEmotionCounts] = useState<EmotionCount[]>([
    { emotion: 'joy', count: 0 },
    { emotion: 'wonder', count: 1 },
    { emotion: 'reflection', count: 0 },
    { emotion: 'curiosity', count: 0 },
  ]);
  const [emotionTrends, setEmotionTrends] = useState<EmotionTrend[]>([
    { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), emotion: 'wonder' },
  ]);

  // Use the custom therapist API hook
  const { getTherapistResponse, loading, error } = useTherapistAPI();

  // Function to update emotion counts and trends
  const trackEmotion = (emotion: Emotion) => {
    setEmotionCounts((prev) =>
      prev.map((item) =>
        item.emotion === emotion ? { ...item, count: item.count + 1 } : item
      )
    );
    setEmotionTrends((prev) => [
      ...prev,
      { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), emotion },
    ]);
  };

  // Function to unlock achievements
  const unlockAchievement = (achievementId: string) => {
    const achievement = achievements.find((a) => a.id === achievementId && !a.unlocked);
    if (achievement) {
      setAchievements((prev) =>
        prev.map((a) => (a.id === achievementId ? { ...a, unlocked: true } : a))
      );
      setCurrentAchievement(achievement);
      setShowAchievement(true);
      setSessionProgress((prev) => Math.min(prev + 15, 100));
    }
  };

  // The message handler for chat input
  const handleSendMessage = async (messageText: string) => {
    // Create and add the user's message
    const playerMessage: Message = {
      id: `p${Date.now()}`,
      text: messageText,
      sender: 'player',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, playerMessage]);
    setSessionProgress((prev) => Math.min(prev + 5, 100));

    // Analyze and track the emotion locally
    const emotion = analyzeSentiment(messageText);
    trackEmotion(emotion);

    // Save a memory if the input is long enough
    if (messageText.length > 15) {
      const newMemory: Memory = {
        id: `m${Date.now()}`,
        title: `Reflection on ${new Date().toLocaleDateString()}`,
        description:
          messageText.length > 50 ? `${messageText.substring(0, 50)}...` : messageText,
        emotion,
        relatedMessages: [playerMessage.id],
        timestamp: new Date(),
      };
      setMemories((prev) => [...prev, newMemory]);
      setInsightsCount((prev) => prev + 1);
      if (insightsCount >= 2 && !achievements[3].unlocked) {
        unlockAchievement('a4');
      }
    }

    // Fetch the therapist's response from your backend
    const therapistData = await getTherapistResponse(messageText);

    if (therapistData) {
      // Optionally, update emotion tracking using therapistData.emotion here.
      const therapistMessage: Message = {
        id: `c${Date.now()}`,
        text: therapistData.response,
        sender: 'companion', // You can change this label to 'therapist' in your UI if preferred
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, therapistMessage]);

      // Achievement logic (example thresholds)
      if (messages.length > 6 && !achievements[1].unlocked) {
        unlockAchievement('a2');
      }
      if (messages.length > 10 && !achievements[2].unlocked) {
        unlockAchievement('a3');
      }
    } else {
      console.error('Error fetching therapist response:', error);
      // Optionally, display an error message in your chat interface.
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-radial from-teal-50 via-blue-50 to-purple-50 overflow-hidden">
      <Particles quantity={10} />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-800 mb-2">
            MindfulReflect
          </h1>
          <p className="text-blue-700 max-w-xl mx-auto">
            A compassionate guide for emotional growth and self-discovery
          </p>
        </header>
        <DisclaimerBanner />
        <div className="max-w-6xl mx-auto">
          <UnifiedInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            sessionProgress={sessionProgress}
            reflectionStreak={reflectionStreak}
            insightsCount={insightsCount}
            achievements={achievements}
            recentMemories={memories}
            emotionCounts={emotionCounts}
            emotionTrends={emotionTrends}
          />
        </div>
        <footer className="mt-8 text-center text-teal-500 text-sm">
          <p>MindfulReflect - Your companion for emotional growth and self-discovery</p>
          <p className="text-xs mt-1">
            Remember: This is a self-reflection tool, not a substitute for professional therapy.
          </p>
        </footer>
      </div>
      <DreamTransition isActive={showTransition} onTransitionEnd={() => setShowTransition(false)}>
        {transitionMessage && (
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg animate-float">
            {transitionMessage}
          </h2>
        )}
      </DreamTransition>
      {currentAchievement && (
        <AchievementPopup
          title={currentAchievement.title}
          description={currentAchievement.description}
          isVisible={showAchievement}
          onClose={() => setShowAchievement(false)}
        />
      )}
    </div>
  );
};

export default Index;
