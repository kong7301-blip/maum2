import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Heart, Sparkles } from 'lucide-react';

export const BreathingView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Switch phase
            if (phase === 'inhale') {
              setPhase('hold');
              return 4;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return 6;
            } else {
              setPhase('inhale');
              setCycleCount((c) => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCountdown(4);
    setCycleCount(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return '숨을 천천히 들이마십니다...';
      case 'hold':
        return '가만히 숨을 머금고 멈춥니다...';
      case 'exhale':
        return '오늘의 모든 긴장과 타인의 짐을 길게 내쉽니다...';
    }
  };

  const getScaleClass = () => {
    if (!isActive) return 'scale-100';
    if (phase === 'inhale') return 'scale-125 transition-transform duration-[4000ms] ease-out';
    if (phase === 'hold') return 'scale-125 transition-transform duration-[4000ms]';
    return 'scale-90 transition-transform duration-[6000ms] ease-in-out';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center text-center space-y-8">
      {/* Description */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <span>🌿 상담사를 위한 쉼 호흡 (Down-regulation)</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          타인의 마음을 비우고, 내 호흡으로 돌아오기
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
          상담을 마친 후 교감신경의 긴장을 낮추고 오롯이 나 자신으로 돌아오는 1분 이완 호흡입니다.
        </p>
      </div>

      {/* Breathing Animated Circle */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        {/* Soft Background glow rings */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/10 to-teal-400/20 blur-xl transition-all duration-1000 ${
            isActive ? 'opacity-100' : 'opacity-40'
          }`}
        />

        {/* Breathing Circle */}
        <div
          className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white flex flex-col items-center justify-center shadow-xl shadow-emerald-700/20 relative z-10 ${getScaleClass()}`}
        >
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-xs">
            {isActive ? countdown : '쉼'}
          </span>
          <span className="text-xs uppercase tracking-widest mt-1 opacity-90 font-medium">
            {isActive ? phase : '준비'}
          </span>
        </div>
      </div>

      {/* Dynamic Instruction */}
      <div className="h-12 flex flex-col items-center justify-center">
        <p className="text-base sm:text-lg font-medium text-stone-800 dark:text-stone-200 transition-all">
          {isActive ? getPhaseText() : '아래 시작 버튼을 누르고 호흡의 리듬을 따라가 보세요.'}
        </p>
        {cycleCount > 0 && (
          <span className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-semibold">
            {cycleCount}회 호흡 완료 🌿 마음이 조금씩 가벼워집니다
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4" />
              <span>잠시 멈춤</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>호흡 시작하기</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          title="처음으로"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Counselor Note */}
      <div className="max-w-md p-4 rounded-xl bg-stone-100/70 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400 leading-relaxed text-left space-y-1">
        <strong className="text-stone-800 dark:text-stone-200 block font-semibold">
          💡 퇴근 전 '마음 경계 짓기' 의식
        </strong>
        <p>
          상담실 문을 닫기 전 3번의 깊은 호흡을 하며 <em>"내담자의 이야기는 상담실에 남겨두고, 나 자신의 삶으로 돌아갑니다"</em>라고 마음속으로 읊조려 보세요.
        </p>
      </div>
    </div>
  );
};
