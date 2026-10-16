export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  situationId?: number;
  stages?: {
    reflect?: string;
    normalize?: string;
    explore?: string;
  };
}

export type ThemeMode = 'warm' | 'night' | 'forest';
