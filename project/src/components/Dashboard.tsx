import React, { useState } from 'react';
import { useStore } from '../store';
import { MessageSquare, CheckSquare, Book, Phone, Send, Plus, Check, X, Menu, X as Close } from 'lucide-react';
import contacts from "../data/innovationContactPerson.json";
import { ChevronDown, CheckCircle } from "lucide-react";

export function Dashboard() {
  const { todos, chatMessages, addChatMessage, wikiArticles } = useStore();
  const [newTodo, setNewTodo] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      addChatMessage({ text: message, sender: 'user' });
      // Simulate bot response
      setTimeout(() => {
        addChatMessage({
          text: "I'm here to help! What would you like to know?",
          sender: 'bot',
        });
      }, 1000);
      setMessage('');
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  const initialTodos = [
    { id: 1, title: "Buy Groceries", details: "Milk, Eggs, Bread, Butter", completed: false },
    { id: 2, title: "Workout", details: "Run 5km and do strength training", completed: false },
    { id: 3, title: "Study React", details: "Finish hooks and state management module", completed: false },
    { id: 4, title: "Clean Room", details: "Organize desk, vacuum floor, and dust shelves", completed: false },
    { id: 5, title: "Call Mom", details: "Catch up on the week and discuss weekend plans", completed: false },
  ];

  const [todosList, setTodos] = useState(initialTodos);
  const [nextId, setNextId] = useState(6);

  const toggleTodo = async (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    const newTodo = await fetchNewTodo();
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setNextId(nextId + 1);
  };

  const fetchNewTodo = async () => {
    try {
      const response = await fetch("https://api.infomaniak.com/1/ai/103319/openai/chat/completions", {
        method: "POST",
        mode: 'no-cors',
        headers: {
          Authorization: "Bearer _OfbZ9CCsw8JZjavmxZW4WtkugJSw1L7pikn6DLKW22X4H9Zg7HmSwDpUG8_iLzmPD_c2ZimtZhAYrDc",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              content: "Make a todo :P",
              role: "user",
            },
          ],
          model: "mixtral",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read error message
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      const generatedContent = data?.choices?.[0]?.message?.content || "Generated Task";
      alert(data)
      return {
        id: nextId,
        title: `Task ${nextId}`,
        details: generatedContent,
        completed: false,
      };
    } catch (error) {
      console.error("Error fetching new todo:", error);
      return {
        id: nextId,
        title: `Task ${nextId}`,
        details: "Failed to generate task. Try again later.",
        completed: false,
      };
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
      case 'todos':
        return (
            <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Todo List</h1>
            <div className="space-y-4">
              {todosList.map((todo) => (
                <div
                  key={todo.id}
                  className={`p-4 flex justify-between items-center shadow-md bg-white rounded-lg ${todo.completed ? "opacity-50" : ""}`}
                >
                  <div>
                    <h2 className={`text-lg font-semibold ${todo.completed ? "line-through text-gray-500" : ""}`}>{todo.title}</h2>
                    <p className={`text-sm ${todo.completed ? "line-through text-gray-400" : "text-gray-600"}`}>{todo.details}</p>
                  </div>
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`p-2 rounded transition ${todo.completed ? "bg-green-300" : "bg-green-500 hover:bg-green-600 text-white"}`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'wiki':
        return (
          <div className="p-4 space-y-4 h-[calc(100vh-8rem)] overflow-y-auto">
            {wikiArticles.map((article) => (
              <div key={article.id} className="p-4 border rounded-lg bg-white">
                <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-600">{article.content}</p>
              </div>
            ))}
          </div>
        );

      case 'contact':
        return (
          <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contacts</h1>
      {contacts.map((contact, index) => (
        <ContactCard key={index} contact={contact} />
      ))}
    </div>
        );

      default:
        return null;
    }
  };

  const menuItems = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'todos', icon: CheckSquare, label: 'Todo List' },
    { id: 'wiki', icon: Book, label: 'Wiki' },
    { id: 'contact', icon: Phone, label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-800">{menuItems.find(item => item.id === activeTab)?.label}</h1>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <Close className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`fixed right-0 top-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

interface Contact {
  Name: string;
  Institution: string;
  Contact: string;
  Category: string;
  Description: string;
  FocusAreas: string;
  Website: string;
}

function ContactCard({ contact }: { contact: Contact }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-md bg-white relative">
      <h2 className="text-lg font-semibold">{contact.Name}</h2>
      <p className="text-gray-600">{contact.Institution}</p>
      <p className="text-blue-500">
        <a href={`mailto:${contact.Contact}`} className="underline">{contact.Contact}</a>
      </p>
        <button
        className="absolute top-4 right-4 text-blue-700 transition-transform duration-300"
        onClick={() => setExpanded(!expanded)}
      >
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <div className="mt-2 text-gray-700">
          <p><strong>Category:</strong> {contact.Category}</p>
          <p><strong>Description:</strong> {contact.Description}</p>
          <p><strong>Focus Areas:</strong> {contact.FocusAreas}</p>
          <p><strong>Website:</strong> <a href={contact.Website} className="text-blue-500" target="_blank">Visit</a></p>
        </div>
      )}
    </div>
  );
}

export default ContactCard;
