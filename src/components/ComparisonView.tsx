import React from 'react';
import { FORBIDDEN_VS_RECOMMENDED } from '../data/promptGuide';
import { Ban, CheckCircle, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

export const ComparisonView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Intro Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-stone-900 to-stone-800 text-white shadow-md space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
          <Ban className="w-3.5 h-3.5" />
          <span>금지 표현 vs 권장 표현 비교표</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          상담사에게 '공허한 응원'은 상처가 됩니다
        </h2>
        <p className="text-sm text-stone-300 leading-relaxed max-w-3xl">
          상담사는 이미 모든 심리 기법과 해결책을 꿰뚫고 있는 전문가입니다.
          상담사에게 던지는 "힘내세요", "긍정적으로 생각하세요" 같은 섣부른 긍정주의(Toxic Positivity)는 오히려 고립감을 심화시킵니다.
          아래는 마음 쉼터가 철저히 배제하는 금지어와 지향하는 공감 언어의 비교입니다.
        </p>
      </div>

      {/* Comparison Cards / Table */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FORBIDDEN_VS_RECOMMENDED.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Forbidden Section */}
              <div className="p-4 bg-rose-50/60 dark:bg-rose-950/20 border-b border-rose-100 dark:border-rose-900/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                    <Ban className="w-3.5 h-3.5 text-rose-600" />
                    절대 금지 표현
                  </span>
                  {item.reason && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 font-medium">
                      이유: {item.reason}
                    </span>
                  )}
                </div>
                <div className="text-base font-semibold text-rose-900 dark:text-rose-200 line-through decoration-rose-400">
                  "{item.forbidden}"
                </div>
              </div>

              {/* Recommended Section */}
              <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1.5">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  마음 쉼터의 권장 표현
                </span>
                <div className="text-base font-semibold text-emerald-900 dark:text-emerald-200">
                  "{item.recommended}"
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Psychology Behind The Rules */}
      <div className="bg-stone-50 dark:bg-stone-900/50 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 space-y-4">
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          왜 이런 금지 규칙이 필요할까요?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
            <strong className="text-stone-800 dark:text-stone-200 block text-sm">
              1. 섣부른 조언 거부
            </strong>
            상담사는 조언이 필요해서 말하는 것이 아닙니다. 하루 종일 남의 감정을 담아내느라 텅 빈 자신의 잔을 채울 여백이 필요한 것입니다.
          </div>
          <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
            <strong className="text-stone-800 dark:text-stone-200 block text-sm">
              2. AI의 인간 흉내 금지
            </strong>
            "저도 비슷한 경험이..." 같은 말은 거짓 공감입니다. 인공지능은 감정을 느끼지 못함을 솔직히 인정하되, 곁에서 묵묵히 들어주는 존재로 머물러야 합니다.
          </div>
          <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 space-y-1">
            <strong className="text-stone-800 dark:text-stone-200 block text-sm">
              3. 죄책감 없는 피로 인정
            </strong>
            "상담사인데 내가 이래도 되나?"라는 자기 비하를 막기 위해, 번아웃과 지침은 최선을 다한 증거이자 정상적인 생리적 반응임을 확인시켜 줍니다.
          </div>
        </div>
      </div>
    </div>
  );
};
