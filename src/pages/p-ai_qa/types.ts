

export interface ChatHistoryItem {
  id: string;
  title: string;
  isActive: boolean;
}

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

