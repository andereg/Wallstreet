import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../store';
import { MessageSquare, CheckSquare, Book, Contact, Send, Plus, Check, X, Menu, X as Close } from 'lucide-react';
import contacts from "../data/innovationContactPerson.json";
import { ChevronDown, CheckCircle } from "lucide-react";
import { retrieveUserProblem, storeUserTodos } from "../user/user-store.ts";
import ReactMarkdown from "react-markdown";
import {getTodoPrompts, getUserTodos, UserProblem} from "../ai/profile-gen.ts";
import {WikiArticle} from "./WikiArticle.tsx";
import article1 from './../data/wiki/1_Hesitant_Investitionsrisiko-Aversion_.json';
import article2 from './../data/wiki/2_Hesitant_Kontrollverlust-Befürchtung.json';
import article3 from './../data/wiki/3_Hesitant_Veränderungswiderstand.json';
import article5 from './../data/wiki/5_Hesitant_Kompetenzunsicherheit.json';
import article6 from './../data/wiki/6_Hesitant_Übergangsmanagement-Ängste.json';
import article7 from './../data/wiki/7_Hesitant_Wettbewerbsdruck-Dilemma.json';

export function Dashboard() {
  const { todos, chatMessages, addChatMessage, wikiArticles } = useStore();
  const [loadingNewTodo, setLoadingNewTodo] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProblem, setUserProblem] = useState<UserProblem>("");

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isLongText, setIsLongText] = React.useState(false);
  const [previewText, setPreviewText] = React.useState("");

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

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

  ];

  const [todosList, setTodos] = useState(initialTodos);
  const [nextId, setNextId] = useState(6);

  const toggleTodo = async (id) => {
    setTodos((prevTodos) => {
      const newTodos = prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )

      storeUserTodos(newTodos);
      return newTodos;
    });
    setLoadingNewTodo(true);
    let newTodo = await fetchNewTodo();
    if (Array.isArray(newTodo)) {
      newTodo = newTodo[0];
    }

    setTodos((prevTodos) => {
      const newList = [...prevTodos, newTodo];
      newList.map((it, idx) => it.id = idx);
      storeUserTodos(newList);
      return newList;
    });
    setLoadingNewTodo(false);
    setNextId(nextId + 1);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      const todos = await getUserTodos(problem);
      const allTodos: { id: number, title: string, details: string, completed: boolean }[] = JSON.parse(todos.details);
      setTodos(allTodos);
      storeUserTodos(allTodos);
    }
    const problem = retrieveUserProblem() ?? '';
    setUserProblem(JSON.parse(problem));
    fetchTodos();
  }, [])

  const fetchNewTodo = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...getTodoPrompts(JSON.stringify(userProblem)),
            { role: "assistant", content: JSON.stringify(todosList) },
            { role: "user", content: "Generiere ein neues Todo im richtigen JSON format auf Deutsch." },
          ],
          model: "mixtral",
        }),
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);

      const data = await response.json();
      console.log(data?.choices?.[0]?.message?.content)
      return JSON.parse(data?.choices?.[0]?.message?.content ?? '');
    } catch (error) {
      console.error("Error fetching new todo:", error);
      return { id: nextId, title: `Task ${nextId}`, details: "Failed to fetch", completed: false };
    }
  };

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ content: input, role: "user" }],
          model: "mixtral",
        }),
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);

      const data = await response.json();
      const botReply = {
        role: "bot",
        content: data?.choices?.[0]?.message?.content || "No response received.",
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "Error fetching response." }]);
    }

    setLoading(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="border rounded-lg p-4 mb-4 shadow-md bg-white relative transition-all duration-300">
            {/* Header */}
            <h1 className="text-2xl font-bold mb-4">AI-Chat für Innovation</h1>
            {/* Chat Messages Box */}
            <div className="h-96 overflow-y-auto p-3 border rounded-md flex flex-col space-y-2 animated-margin">
            {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="relative max-w-[70%]">
                    {/* Chat Bubble */}
                    <div
  className={`relative p-3 rounded-lg text-white shadow-md break-words bg-gray-800 bg-opacity-80 text-gray-900  ${
    msg.role === "user"
      ? "text-right rounded-br-none self-end " // User message (right)
      : "text-left rounded-bl-none self-start" // Bot message (left)
  }`}
>
  {msg.content}
</div>

                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Section */}
            <div className="flex items-center mt-4">
              <input
                type="text"
                class="flex-1 p-2 border 
                focus-visible:outline-none focus-visible:ring-4 
                focus-visible:ring-gray-300 focus-visible:border-gray-400 
                focus-visible:ring-opacity-50 transition-all duration-20"
                placeholder="Schreibe deine Frage..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                className="button-chat disabled:opacity-50 transition-all duration-300"
                disabled={loading}
              >
                Send
              </button>
            </div>
          </div>
        );
      case 'todos':
        return (
          <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Hier liegen Ihre Herausforderungen 🎉</h1>
            <div className="markdown-container mb-10">
                <h2 className="text-2xl font-bold mb-5">Kategorie:</h2>
                <h3 className="text-l mb-5 italic">{userProblem.category}</h3>
                <h2 className="text-2xl font-bold mb-5">Beschreibung:</h2>
                <p>{userProblem.description}</p>
                {isExpanded ? <div>
                    <h2 className="text-2xl font-bold mt-5 mb-5">Auswirkungen:</h2>
                    <p className="mb-5">{userProblem.impact}</p>
                </div> : ''}

                <button
                  onClick={toggleExpand}
                  className="button-light-outline text-white px-4 py-2 rounded mt-2"
                >
                  {isExpanded ? "Weniger anzeigen" : "Mehr anzeigen"}
                </button>

            </div>
            <h1 className="text-2xl font-bold mb-4">Was Sie jetzt tun können</h1>
            <div className="space-y-4">
              {todosList.length === 0 ? 'Lade Checkliste...' : ''}
              {todosList.map((todo) => (
                <div
                  key={todo.id}
                  className={`p-4 flex justify-between items-center shadow-md bg-white rounded-lg ${todo.completed ? "opacity-50" : ""}`}
                >
                  <div>
                    <h2 className={`text-lg font-semibold ${todo.completed ? "line-through text-gray-500" : ""}`}>{todo.title}</h2>
                    <p className={`pr-1 text-sm ${todo.completed ? "line-through text-gray-400" : ""}`}>{todo.details}</p>
                  </div>
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`p-2 rounded transition ${todo.completed ? "bg-green-50 text-gray-600" : ""}`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {loadingNewTodo ? <p className="centered-fade">
  Lade neues Todo...
</p> : ''}
            </div>
          </div>
        );

      case 'wiki':
        return (
          <div className="p-4 space-y-4 h-[calc(100vh-8rem)] overflow-y-auto">
              <h1 className="text-2xl font-bold mb-4 mt-4">Werkzeuge für Wandel & Wachstum</h1>

            <div >
              <div className="mb-5">
                <WikiArticle data={article1} />
              </div>
              <div className="mb-5">

              <WikiArticle data={article2} />
              </div>
              <div className="mb-5">

              <WikiArticle data={article3} />
              </div>
              <div className="mb-5">

                <WikiArticle data={article5} />
              </div>
              <div className="mb-5">

                <WikiArticle data={article6} />
              </div>
              <div className="mb-5">

                <WikiArticle data={article7} />
              </div>
              </div>
          </div>
        );

      case 'contact':
        return (
          <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Network</h1>
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
    { id: 'todos', icon: CheckSquare, label: 'Analyse' },
    { id: 'wiki', icon: Book, label: 'Innovation Guide' },
    { id: 'chat', icon: MessageSquare, label: 'AI-Chat' },
    { id: 'contact', icon: Contact, label: 'Network' },
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
              className="button-reveal-border p-2 focus:outline-none text-gray-1000 "
            >
              {isMenuOpen ? <Close className="w-6 h-6 text-gray-1000" /> : <Menu className="w-6 h-6 text-gray-1000" />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-40 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`fixed right-0 top-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 space-y-2 mt-24">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center ${activeTab === item.id
                      ? 'button-light-outline bg-green-50 text-gray-600 hover:text-white transition-all duration-300'
                      : ''
                    }`}
                >
                  <Icon className="w-5 h-5" style={{ marginRight: "10px" }} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-4xl mx-auto mt-5">
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
    <div className="border rounded-lg p-4 mb-4 shadow-md bg-white relative transition-all duration-300">
      <h2 className="text-lg font-semibold">{contact.Name}</h2>
      <p>{contact.Institution}</p>
      <p className="text-blue-500">
        <a href={`mailto:${contact.Contact}`} className="underline">
          {contact.Contact}
        </a>
      </p>

      {/* Expand Button */}
      <button
        style={{ padding: "10px" }} className="button-light-outline absolute top-4 right-4 transition-transform duration-300"
        onClick={() => setExpanded(!expanded)}
      >
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Expandable Content with Smooth Animation */}
      <div
        className={`transition-all duration-700 overflow-hidden`}
        style={{
          maxHeight: expanded ? "400px" : "0px",
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="mt-2 text-gray-700">
          <p>
            <strong>Category:</strong> {contact.Category}
          </p>
          <p>
            <strong>Description:</strong> {contact.Description}
          </p>
          <div className="flex justify-between items-center w-full text-gray-700">
            {/* Focus Areas on the Left */}
            <p>
              <strong>Focus Areas:</strong> {contact.FocusAreas}
            </p>

            {/* Website Link on the Right */}
            <a
              href={contact.Website}
              target="_blank"
              className="button-reveal-border flex items-center gap-2 text-green-700 hover:text-green-900 transition-all duration-300"
            >
              Visit Website
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-globe"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" x2="22" y1="12" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactCard;
