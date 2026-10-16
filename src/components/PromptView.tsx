import React, { useState } from 'react';
import { SYSTEM_META_PROMPT } from '../data/promptGuide';
import { Copy, Check, Terminal, Shield, Sparkles } from 'lucide-react';

export const PromptView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SYSTEM_META_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-stone-900 text-white shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold">시스템 프롬프트 (메타프롬프트)</h2>
          </div>
          <p className="text-xs text-stone-400">
            PDF 문서에 명시된 원문 그대로의 시스템 프롬프트입니다.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>복사 완료!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-emerald-400" />
              <span>시스템 프롬프트 복사</span>
            </>
          )}
        </button>
      </div>

      {/* Code Prompt Box */}
      <div className="relative rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-stone-100 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-[11px]">mind_shelter_meta_prompt.txt</span>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Gemini 3.8 Flash 최적화</span>
        </div>

        <pre className="p-5 font-mono text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-emerald-200 dark:selection:bg-emerald-900">
          {SYSTEM_META_PROMPT}
        </pre>
      </div>

      {/* Application Note */}
      <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
        <strong className="flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          적용 팁
        </strong>
        <p className="leading-relaxed">
          AI 챗봇 시스템 프롬프트(System Instruction) 입력창에 위 전문을 그대로 붙여 넣으면,
          일반적인 AI 모델도 상담사를 가르치거나 섣부른 조언을 하지 않고
          <strong> '감정 반영 → 정상화 → 침묵과 여백'</strong> 원칙을 온전히 수행하게 됩니다.
        </p>
      </div>
    </div>
  );
};
