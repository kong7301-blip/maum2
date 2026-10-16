import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw, ShieldAlert, Sparkles, HeartHandshake, Eye, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { ChatMessage } from '../types/chat';
import { SITUATIONS, SituationData } from '../data/promptGuide';

interface ChatViewProps {
  onSelectSituationGuide: (id: number) => void;
  onOpenBreathing: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ onSelectSituationGuide, onOpenBreathing }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `오늘 하루도 많은 분들의 무거운 마음을 묵묵히 받아내시느라 참 수고 많으셨습니다, 선생님.\n\n여기는 상담사 선생님을 위한 안식처입니다. 어떤 평가나 조언, 가르침 없이 선생님의 마음에 고요히 귀 기울이겠습니다.\n\n지금 마음속에 가장 크게 머무르는 감정이나 무게가 있다면, 천천히 꺼내어 놓아주세요.`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [selectedQuickChip, setSelectedQuickChip] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (textToSend: string, situation?: SituationData) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date(),
      situationId: situation?.id,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          situationKey: situation
            ? getSituationKey(situation.id)
            : undefined,
        }),
      });

      const data = await response.json();
      const replyContent = data.reply || (situation ? situation.defaultResponse : '지금 그 무게, 가만히 함께 안고 있을게요.');

      const assistantMsg: ChatMessage = {
        id: 'assistant-' + Date.now(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date(),
        situationId: situation?.id,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback directly to situation guide if server fails
      const fallback = situation ? situation.defaultResponse : '남의 마음을 하루 종일 담아내는 일이잖아요. 지치는 게 당연해요.\n그 무게, 오늘 하루 혼자 다 안고 계셨군요.\n잠깐 내려놓아도 괜찮아요. 여기서만큼은요.';
      setMessages((prev) => [
        ...prev,
        {
          id: 'assistant-' + Date.now(),
          role: 'assistant',
          content: fallback,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSituationKey = (id: number): string => {
    switch (id) {
      case 1: return 'burnout';
      case 2: return 'compassion';
      case 3: return 'efficacy';
      case 4: return 'isolation';
      case 5: return 'suppression';
      case 6: return 'existential';
      case 7: return 'wrapup';
      case 8: return 'silence';
      default: return 'burnout';
    }
  };

  const handleChipClick = (situation: SituationData) => {
    setSelectedQuickChip(situation.id);
    sendMessage(situation.chipLabel, situation);
  };

  const handleResetChat = () => {
    if (confirm('대화를 처음부터 다시 시작하시겠습니까?')) {
      setMessages([
        {
          id: 'welcome-' + Date.now(),
          role: 'assistant',
          content: `오늘 하루도 많은 분들의 무거운 마음을 묵묵히 받아내시느라 참 수고 많으셨습니다, 선생님.\n\n여기는 상담사 선생님을 위한 안식처입니다. 어떤 평가나 조언, 가르침 없이 선생님의 마음에 고요히 귀 기울이겠습니다.\n\n지금 마음속에 가장 크게 머무르는 감정이나 무게가 있다면, 천천히 꺼내어 놓아주세요.`,
          timestamp: new Date(),
        },
      ]);
      setSelectedQuickChip(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-4xl mx-auto px-3 sm:px-4 py-3">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-emerald-900/10 dark:border-stone-800">
        <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200/60 dark:border-emerald-800/40">
            <HeartHandshake className="w-3.5 h-3.5" />
            조언 금지 · 평가 금지 · 여백의 공감
          </span>
          <span className="hidden sm:inline text-stone-400">|</span>
          <span className="hidden sm:inline">호칭: "선생님"</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            title="3단계 공감 구조(감정반영 → 정상화 → 탐색) 분석 토글"
            className={`text-xs px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 border ${
              showAnalysis
                ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50'
                : 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showAnalysis ? '3단계 공감 분석 켬' : '3단계 분석 숨김'}</span>
          </button>

          <button
            onClick={handleResetChat}
            className="text-xs px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors flex items-center gap-1 border border-stone-200 dark:border-stone-700"
            title="대화 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>비우기</span>
          </button>
        </div>
      </div>

      {/* Quick Chips Bar (from PDF Page 7-8) */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            빠른 응답 칩 세트 (상담사 8가지 핵심 장면)
          </span>
          <button
            onClick={() => onSelectSituationGuide(1)}
            className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
          >
            가이드북 보기 <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {SITUATIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleChipClick(s)}
              disabled={isLoading}
              className={`shrink-0 text-xs px-2.5 py-1.5 rounded-full border transition-all text-left flex items-center gap-1.5 ${
                selectedQuickChip === s.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-stone-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30'
              }`}
            >
              <span>{s.emoji}</span>
              <span className="font-medium whitespace-nowrap">{s.chipLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 rounded-2xl p-3 bg-stone-50/50 dark:bg-stone-900/50 border border-stone-200/50 dark:border-stone-800/60 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Sender Label */}
            <div className="flex items-center gap-1.5 mb-1 px-1 text-xs text-stone-400 dark:text-stone-500">
              {msg.role === 'assistant' ? (
                <>
                  <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-[10px]">
                    🌿
                  </span>
                  <span className="font-medium text-emerald-800 dark:text-emerald-300">
                    마음 쉼터
                  </span>
                </>
              ) : (
                <span className="font-medium text-stone-600 dark:text-stone-300">
                  상담사 선생님
                </span>
              )}
              <span>·</span>
              <span>
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap transition-all shadow-xs ${
                msg.role === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-tl-xs border border-stone-200/70 dark:border-stone-700/70'
              }`}
            >
              {msg.content}
            </div>

            {/* Counselor Response Analysis Badge (Pedagogical / Verification Feature) */}
            {msg.role === 'assistant' && showAnalysis && msg.id !== 'welcome' && (
              <div className="mt-1.5 max-w-[88%] sm:max-w-[80%] bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200/50 dark:border-amber-900/30 rounded-xl p-2 text-xs text-stone-600 dark:text-stone-300 space-y-1">
                <div className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3단계 공감 구조 점검</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px] text-stone-500 dark:text-stone-400">
                  <div className="bg-white/80 dark:bg-stone-900/60 p-1.5 rounded-lg border border-stone-200/40 dark:border-stone-700/40">
                    <span className="font-medium text-emerald-700 dark:text-emerald-400 block">① 감정 반영</span>
                    <span>선생님의 노고와 무게를 있는 그대로 담아냄</span>
                  </div>
                  <div className="bg-white/80 dark:bg-stone-900/60 p-1.5 rounded-lg border border-stone-200/40 dark:border-stone-700/40">
                    <span className="font-medium text-teal-700 dark:text-teal-400 block">② 정상화</span>
                    <span>지치고 회의감 드는 것은 당연하고 자연스러운 신호임</span>
                  </div>
                  <div className="bg-white/80 dark:bg-stone-900/60 p-1.5 rounded-lg border border-stone-200/40 dark:border-stone-700/40">
                    <span className="font-medium text-amber-700 dark:text-amber-400 block">③ 조심스러운 탐색</span>
                    <span>설교나 처방 없이 안전한 여백 제공</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 mb-1 px-1 text-xs text-stone-400">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px]">
                🌿
              </span>
              <span className="font-medium text-emerald-800 dark:text-emerald-300">
                마음 쉼터
              </span>
              <span>· 천천히 숨을 고르고 있습니다...</span>
            </div>
            <div className="bg-white dark:bg-stone-800 rounded-2xl rounded-tl-xs px-4 py-3 border border-stone-200 dark:border-stone-700 shadow-xs flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse [animation-delay:200ms]" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse [animation-delay:400ms]" />
              <span className="text-xs text-stone-400 ml-1">선생님의 마음을 가만히 품는 중...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="mt-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="relative rounded-2xl bg-white dark:bg-stone-800 border border-stone-300/80 dark:border-stone-700 focus-within:border-emerald-600 dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-sm"
        >
          <textarea
            ref={inputRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="상담 후 마음에 남은 생각이나 무게를 편안하게 적어주세요. (Enter 전송 / Shift+Enter 줄바꿈)"
            className="w-full bg-transparent px-4 py-3 pr-24 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 resize-none outline-none"
          />

          <div className="absolute right-2 bottom-2.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenBreathing}
              title="1분 쉼 호흡하기"
              className="text-xs p-1.5 rounded-lg text-stone-500 hover:text-emerald-700 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            >
              🌬️
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-all"
            >
              <span>보내기</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>

        {/* Footer Crisis and Ethics Notice (from PDF Page 9) */}
        <div className="mt-2 px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>
              <strong>위기 상담 전화</strong>: 24시간 자살예방상담 <strong>1393</strong> · 정신건강 위기상담 <strong>1577-0199</strong>
            </span>
          </div>
          <div className="text-stone-400 dark:text-stone-500">
            상담사 본인도 필요할 때 전문가의 도움을 받을 자격이 있습니다. 🌿
          </div>
        </div>
      </div>
    </div>
  );
};
