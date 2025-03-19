import { create } from 'zustand';
import { UserProfile, TodoItem, ChatMessage, WikiArticle } from './types';

interface AppState {
  currentStep: number;
  userProfile: UserProfile;
  todos: TodoItem[];
  chatMessages: ChatMessage[];
  wikiArticles: WikiArticle[];
  setStep: (step: number) => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

export const useStore = create<AppState>((set) => ({
  currentStep: 0,
  userProfile: {
    role: '',
    industry: '',
    experience: '',
    interests: [],
  },
  todos: [],
  chatMessages: [],
  wikiArticles: [
    {
      id: '1',
      title: 'Getting Started',
      content: 'Welcome to your personalized dashboard! Here you can manage tasks, chat with our AI assistant, and access relevant resources.',
    },
  ],
  setStep: (step) => set({ currentStep: step }),
  setUserProfile: (profile) =>
    set((state) => ({
      userProfile: { ...state.userProfile, ...profile },
    })),
  addTodo: (text) =>
    set((state) => ({
      todos: [...state.todos, { id: Date.now().toString(), text, completed: false }],
    })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        { ...message, id: Date.now().toString(), timestamp: new Date() },
      ],
    })),
}));