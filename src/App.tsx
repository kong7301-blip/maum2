/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { GuideView } from './components/GuideView';
import { ComparisonView } from './components/ComparisonView';
import { BreathingView } from './components/BreathingView';
import { PromptView } from './components/PromptView';
import { SituationData, SITUATIONS } from './data/promptGuide';
import { ThemeMode } from './types/chat';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'chat' | 'guide' | 'comparison' | 'breathing' | 'prompt'>('chat');
  const [theme, setTheme] = useState<ThemeMode>('warm');
  const [selectedGuideSituationId, setSelectedGuideSituationId] = useState<number>(1);

  // Apply dark mode class to root html if night theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'night') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleStartChatWithSituation = (situation: SituationData) => {
    setSelectedGuideSituationId(situation.id);
    setCurrentTab('chat');
  };

  const handleSelectSituationGuide = (id: number) => {
    setSelectedGuideSituationId(id);
    setCurrentTab('guide');
  };

  const getThemeBackground = () => {
    switch (theme) {
      case 'forest':
        return 'bg-gradient-to-b from-emerald-50/70 via-stone-50 to-teal-50/40 text-stone-850';
      case 'night':
        return 'bg-stone-950 text-stone-100';
      case 'warm':
      default:
        return 'bg-gradient-to-b from-[#FAF7F2] via-[#F6F3EC] to-[#F1ECE4] text-stone-800';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col font-sans ${getThemeBackground()}`}>
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        theme={theme}
        setTheme={setTheme}
      />

      <main className="flex-1 pb-6">
        {currentTab === 'chat' && (
          <ChatView
            onSelectSituationGuide={handleSelectSituationGuide}
            onOpenBreathing={() => setCurrentTab('breathing')}
          />
        )}
        {currentTab === 'guide' && (
          <GuideView
            onStartChatWithSituation={handleStartChatWithSituation}
            selectedSituationId={selectedGuideSituationId}
          />
        )}
        {currentTab === 'comparison' && <ComparisonView />}
        {currentTab === 'breathing' && <BreathingView />}
        {currentTab === 'prompt' && <PromptView />}
      </main>
    </div>
  );
}
