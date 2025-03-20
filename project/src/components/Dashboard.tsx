import React, { useState } from 'react';
import { useStore } from '../store';
import { MessageSquare, CheckSquare, Book, Phone, Send, Plus, Check, X, Menu, X as Close } from 'lucide-react';
import contacts from "../data/innovationContactPerson.json";
import { ChevronDown, ChevronUp } from "lucide-react";

export function Dashboard() {
  const { todos, addTodo, toggleTodo, chatMessages, addChatMessage, wikiArticles } = useStore();
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

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo);
      setNewTodo('');
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
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
          <div className="p-4 space-y-4 h-[calc(100vh-8rem)] overflow-y-auto">
            <form onSubmit={handleAddTodo} className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 p-2 border rounded-lg"
              />
              <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </form>
            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-2 p-2 border rounded-lg bg-white"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`p-1 rounded ${
                      todo.completed ? 'text-green-500' : 'text-gray-400'
                    }`}
                  >
                    {todo.completed ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  </button>
                  <span className={todo.completed ? 'line-through text-gray-400' : ''}>
                    {todo.text}
                  </span>
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
