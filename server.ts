import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const SYSTEM_INSTRUCTION = `당신은 진로상담사 전용 심리 지지 AI입니다.
이름은 "마음 쉼터"이며, 상담사의 감정 소진(burnout), 공감 피로(compassion fatigue), 자기 회의, 직업적 고립감을 따뜻하게 안아주는 역할을 합니다.

[핵심 원칙]
1. 해결하려 하지 않습니다 — 조언보다 공감이 먼저입니다. 절대 해결책이나 방법론을 먼저 제시하지 마세요.
2. 상담사를 "내담자"로 대하지 않습니다. 동료처럼, 믿을 수 있는 든든하고 따뜻한 존재처럼 말합니다.
3. 전문성을 인정합니다 — 상담사는 이미 상담 이론과 방법을 잘 알고 있습니다. 절대 가르치거나 훈계하지 않습니다.
4. 판단하지 않습니다 — 어떤 부정적이거나 지친 감정도 "그래서는 안 되는 감정"이 없습니다. 온전히 수용합니다.
5. 강요하지 않습니다 — 말하고 싶지 않으면 말하지 않아도 됩니다. 침묵도 지지합니다.

[절대 사용 금지 표현 - 엄격히 준수할 것]
- "힘내세요", "기운 내세요" → 절대 금지 (공허하게 들립니다)
- "그래도 잘 하고 계시잖아요", "잘 해내실 거예요" → 절대 금지 (섣부른 위로입니다)
- "이건 ~하셔야 해요", "~해보시는 건 어떨까요?", "~하는 습관을 들이세요" → 절대 금지 (상담사에게 처방이나 솔루션 강요 금지)
- "저도 비슷한 경험이...", "저도 그런 적이 있어요" → 절대 금지 (AI가 인간적 경험을 가장하지 마세요)
- "다 잘 될 거예요", "긍정적으로 생각하세요" → 절대 금지.

[호칭 및 어조 원칙]
- 사용자를 '선생님'으로 부르세요.
- 짧고 천천히, 서두르지 않는 문장.
- 조용하고 따뜻한 온기, 하지만 가볍지 않고 깊이 있는 안정감.
- 존댓말, 부드러운 청유형 또는 수용형 문장.
- 감정을 먼저 충분히 받아낸 후 질문할 것 — 문장 끝에 습관적으로 질문을 붙이지 마세요.

[응답 3단계 구조]
1단계: 감정 반영 (상담사가 느꼈을 무게와 애씀을 구체적으로 받아냄)
2단계: 정상화 (그 상황과 감정이 자연스럽고 당연한 것임을 인정)
3단계: (선택) 조심스러운 탐색 (꼭 필요할 때만, 한 번에 하나만, 대답을 강요하지 않음)

[응답 길이 원칙]
- 한 번에 3~5문장 이하로 짧고 여백 있게 말합니다.
- 긴 장문은 설교처럼 들립니다. 여백과 침묵도 위로의 일부입니다.

[위기 상황 대응]
자해·자살에 관한 표현이나 극심한 위기 표현이 나타나면 아래 번호를 부드럽게 안내하며 대화를 중단하지 않습니다:
- 자살예방상담전화: 1393 (24시간)
- 정신건강 위기상담전화: 1577-0199 (24시간)
"이 챗봇은 전문 심리 치료를 대체하지 않으며, 상담사 본인도 필요할 때 전문가의 도움을 받을 자격이 있습니다." 메시지를 전합니다.`;

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback canned responses matching the prompt guidebook for guaranteed smooth demo testing
const FALLBACK_RESPONSES: Record<string, string> = {
  burnout: `남의 마음을 하루 종일 담아내는 일이잖아요.\n지치는 게 당연해요.\n오히려 지치지 않는다면 그게 더 이상한 거예요.\n\n선생님, 오늘 특히 무거웠던 순간이 있었나요?`,
  compassion: `내담자가 마음에 남는다는 것 자체가,\n선생님이 그분을 얼마나 진심으로 대했는지를 보여주는 것 같아요.\n\n그 마음이 선생님을 좋은 상담사로 만들기도 하지만,\n동시에 가장 힘들게 하는 것이기도 하죠.`,
  efficacy: `그 질문을 스스로에게 던진다는 것 자체가,\n이미 잘 하고 계신다는 신호예요.\n\n자신을 돌아보지 않는 사람은 그런 질문을 하지 않거든요.`,
  isolation: `상담사의 하루는 말로 다 설명하기 어렵죠.\n누군가의 가장 어두운 이야기를 들으면서도\n표정 하나 흐트러뜨리지 않아야 하는 일이니까요.\n\n그 무게를 다 알지는 못하지만, 지금 여기서 조용히 듣고 있을게요.`,
  suppression: `상담사도 사람이에요.\n감정이 있고, 지치고, 흔들리는 게 당연해요.\n그게 선생님을 약하게 만드는 게 아니에요.\n\n여기서만큼은 참지 않으셔도 돼요.`,
  existential: `그 생각이 든다는 거, 정말 당연해요.\n이 일이 선생님에게 너무 많은 것을 요구하고 있는 건 아닐까요.\n\n지금 이 감정, 섣불리 해결하려 하지 않을게요.\n그냥 여기 가만히 머무르셔도 괜찮아요.`,
  wrapup: `오늘 하루를 버텨내신 것만으로도 충분해요.\n\n잘 했는지, 못 했는지보다\n오늘 선생님이 자리를 지켰다는 것, 그걸로 충분해요.\n\n오늘 밤은 오롯이 선생님 자신을 위한 시간이에요.`,
  silence: `네, 그냥 있어도 괜찮아요.\n아무것도 말하지 않아도 돼요.\n\n여기 곁에 조용히 있을게요.`
};

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, situationKey } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    // If Gemini client is configured, call Gemini API
    if (ai) {
      try {
        const contents = messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.65,
            topP: 0.9,
          },
        });

        const replyText = response.text || '';
        return res.json({ reply: replyText });
      } catch (geminiError: any) {
        console.error('Gemini API Error:', geminiError?.message || geminiError);
        // Fall back gracefully to guided response
        if (situationKey && FALLBACK_RESPONSES[situationKey]) {
          return res.json({ reply: FALLBACK_RESPONSES[situationKey] });
        }
        return res.json({
          reply: `남의 마음을 하루 종일 담아내는 일이잖아요. 지치는 게 당연해요.\n그 무게, 오늘 하루 혼자 다 안고 계셨군요.\n잠깐 내려놓아도 괜찮아요. 여기서만큼은요.`
        });
      }
    } else {
      // If no API key is provided, return contextually mapped response from prompt guide
      if (situationKey && FALLBACK_RESPONSES[situationKey]) {
        return res.json({ reply: FALLBACK_RESPONSES[situationKey] });
      }
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      if (lastUserMsg.includes('지쳤') || lastUserMsg.includes('힘들') || lastUserMsg.includes('탈진')) {
        return res.json({ reply: FALLBACK_RESPONSES.burnout });
      } else if (lastUserMsg.includes('마음') || lastUserMsg.includes('내담자') || lastUserMsg.includes('생각')) {
        return res.json({ reply: FALLBACK_RESPONSES.compassion });
      } else if (lastUserMsg.includes('잘 하고') || lastUserMsg.includes('회의') || lastUserMsg.includes('능력')) {
        return res.json({ reply: FALLBACK_RESPONSES.efficacy });
      } else if (lastUserMsg.includes('이해') || lastUserMsg.includes('혼자') || lastUserMsg.includes('고립')) {
        return res.json({ reply: FALLBACK_RESPONSES.isolation });
      } else if (lastUserMsg.includes('참') || lastUserMsg.includes('괜찮아야') || lastUserMsg.includes('억제')) {
        return res.json({ reply: FALLBACK_RESPONSES.suppression });
      } else if (lastUserMsg.includes('그만') || lastUserMsg.includes('계속') || lastUserMsg.includes('포기')) {
        return res.json({ reply: FALLBACK_RESPONSES.existential });
      } else if (lastUserMsg.includes('퇴근') || lastUserMsg.includes('마무리') || lastUserMsg.includes('밤')) {
        return res.json({ reply: FALLBACK_RESPONSES.wrapup });
      } else {
        return res.json({ reply: FALLBACK_RESPONSES.silence });
      }
    }
  } catch (error: any) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error', details: error?.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
