import React from 'react';
import { Sparkles, BookOpen, Scale, Wind, Copy, Moon, Sun, Trees } from 'lucide-react';
import { ThemeMode } from '../types/chat';

interface HeaderProps {
  currentTab: 'chat' | 'guide' | 'comparison' | 'breathing' | 'prompt';
  setCurrentTab: (tab: 'chat' | 'guide' | 'comparison' | 'breathing' | 'prompt') => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  onOpenPromptModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  theme,
  setTheme,
}) => {
  return (
    <header className="border-b transition-colors duration-300 backdrop-blur-md sticky top-0 z-30 shadow-xs border-emerald-900/10 bg-white/80 dark:bg-stone-900/80 dark:border-stone-800">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <span className="text-xl">🌿</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-stone-800 dark:text-stone-100 tracking-tight">
                마음 쉼터
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
                진로상담사 심리 지지 AI
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              감정 소진 · 공감 피로 · 자기 회의 · 직업적 고립감을 따뜻하게 안아주는 공간
            </p>
          </div>
        </div>

        {/* Navigation Tabs and Theme buttons */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 justify-between sm:justify-end">
          <nav className="flex items-center gap-1 bg-stone-100/80 dark:bg-stone-800/80 p-1 rounded-xl border border-stone-200/60 dark:border-stone-700/60 text-xs sm:text-sm">
            <button
              onClick={() => setCurrentTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'chat'
                  ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>쉼터 대화</span>
            </button>

            <button
              onClick={() => setCurrentTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'guide'
                  ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>8대 상황 가이드</span>
            </button>

            <button
              onClick={() => setCurrentTab('comparison')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'comparison'
                  ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>금지 vs 권장 표현</span>
            </button>

            <button
              onClick={() => setCurrentTab('breathing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'breathing'
                  ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>1분 쉼 호흡</span>
            </button>

            <button
              onClick={() => setCurrentTab('prompt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentTab === 'prompt'
                  ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>메타프롬프트</span>
            </button>
          </nav>

          {/* Theme switcher */}
          <div className="flex items-center gap-1 bg-stone-100/70 dark:bg-stone-800/70 p-1 rounded-xl border border-stone-200/50 dark:border-stone-700/50">
            <button
              title="따뜻한 온기 모드"
              onClick={() => setTheme('warm')}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === 'warm'
                  ? 'bg-white dark:bg-stone-700 text-amber-600 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              title="고요한 숲 모드"
              onClick={() => setTheme('forest')}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === 'forest'
                  ? 'bg-white dark:bg-stone-700 text-emerald-600 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              <Trees className="w-3.5 h-3.5" />
            </button>
            <button
              title="편안한 밤 모드"
              onClick={() => setTheme('night')}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === 'night'
                  ? 'bg-stone-900 text-indigo-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
