import React, { useState } from 'react';
import { SITUATIONS, DESIGN_PRINCIPLES, SituationData } from '../data/promptGuide';
import { Sparkles, ArrowRight, MessageSquare, ShieldCheck, Heart, Info, CheckCircle2 } from 'lucide-react';

interface GuideViewProps {
  onStartChatWithSituation: (situation: SituationData) => void;
  selectedSituationId?: number;
}

export const GuideView: React.FC<GuideViewProps> = ({
  onStartChatWithSituation,
  selectedSituationId = 1,
}) => {
  const [activeId, setActiveId] = useState<number>(selectedSituationId);

  const current = SITUATIONS.find((s) => s.id === activeId) || SITUATIONS[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Introduction Card */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-800 to-teal-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold tracking-wide">
            <span>💬 상황별 프롬프트 세트</span>
            <span>·</span>
            <span>8가지 핵심 장면</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            진로상담사의 마음을 품어주는 8대 상황 가이드북
          </h2>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            상담사는 온종일 내담자의 불안, 실패, 혼란, 좌절을 받아내는 감정 노동자입니다.
            각 장면별로 상담사가 느끼는 심리적 무게를 왜곡하거나 섣불리 해결하려 하지 않고,
            <strong> '감정 반영 → 정상화 → 조심스러운 탐색'</strong>의 3단계로 부드럽게 지지하는 표준 가이드입니다.
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-8xl opacity-10 pointer-events-none select-none">
          🌿
        </div>
      </div>

      {/* Situations Selector & Detailed View */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Side: 8 Situations List */}
        <div className="md:col-span-4 space-y-2">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider px-2">
            8대 상황 목록 (클릭하여 열람)
          </h3>
          <div className="space-y-1.5">
            {SITUATIONS.map((sit) => {
              const isActive = sit.id === activeId;
              return (
                <button
                  key={sit.id}
                  onClick={() => setActiveId(sit.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-600 text-emerald-950 dark:text-emerald-200 font-semibold shadow-xs'
                      : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base">{sit.emoji}</span>
                    <div className="truncate">
                      <div className="text-xs text-stone-400 font-normal">
                        상황 {sit.id}
                      </div>
                      <div className="text-sm truncate">
                        {sit.title.split(' · ')[1]}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-emerald-600 translate-x-0.5' : 'text-stone-300 dark:text-stone-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Situation Deep Dive */}
        <div className="md:col-span-8 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 sm:p-6 space-y-6 shadow-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-700">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{current.emoji}</span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {current.title}
                </h3>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                첫 화면 빠른 응답 칩 문구: <code className="bg-stone-100 dark:bg-stone-700 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-300 font-medium">{current.chipLabel}</code>
              </p>
            </div>

            <button
              onClick={() => onStartChatWithSituation(current)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>대화창에서 테스트하기</span>
            </button>
          </div>

          {/* Trigger & Guidelines */}
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-xl p-3.5 bg-stone-50 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-stone-400" />
                사용자 발화 상황 (트리거)
              </span>
              <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
                {current.triggerCondition}
              </p>
            </div>

            <div className="rounded-xl p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 space-y-1">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-emerald-600" />
                챗봇 응답 방향 (상담 원칙)
              </span>
              <p className="text-sm text-stone-700 dark:text-stone-200 leading-relaxed">
                {current.responseGuideline}
              </p>
            </div>
          </div>

          {/* Default Response Example */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                기본 응답 예시 (PDF 표준 문안)
              </span>
              <span className="text-[11px] text-stone-400">여백 있는 3~5문장</span>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/70 border-l-4 border-emerald-600 border-t border-r border-b border-stone-200 dark:border-stone-700 font-sans text-sm text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed shadow-inner">
              {current.defaultResponse}
            </div>
          </div>

          {/* Follow-up / Specific Context Example */}
          {current.followUpResponse && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                후속 응답 예시 — [{current.followUpResponse.condition}]
              </span>
              <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border-l-4 border-amber-500 border-t border-r border-b border-amber-200/50 dark:border-amber-900/30 text-sm text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed">
                {current.followUpResponse.response}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4 Core Design Principles from PDF Page 8-9 */}
      <div className="pt-6 border-t border-stone-200 dark:border-stone-800">
        <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
          <span>💡</span> 챗봇 설계 4대 원칙 (PDF 기준)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DESIGN_PRINCIPLES.map((dp, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xs space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{dp.icon}</span>
                <h4 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                  {dp.title}
                </h4>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {dp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
