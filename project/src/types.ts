export interface UserProfile {
  role: string;
  industry: string;
  experience: string;
  interests: string[];
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface WikiArticle {
  id: string;
  title: string;
  content: string;
}