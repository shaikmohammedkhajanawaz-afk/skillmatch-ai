import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Compass, 
  CheckCircle2, 
  Calendar, 
  Target, 
  Briefcase, 
  BookOpen,
  RefreshCw,
  RotateCcw,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AICareerChatbot({ isFloating = false, onCloseFloating }) {
  const { user, userSkills } = useAuth();
  const messagesEndRef = useRef(null);

  const initialWelcomeMessage = {
    id: 1,
    sender: 'bot',
    text: `Hello ${user?.name || 'Candidate'}! 👋 How can I help you today? Ask me any questions about careers, resumes, skills, programming, or interview preparation.`,
    prompts: []
  };

  const [messages, setMessages] = useState([initialWelcomeMessage]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleClearChat = () => {
    setMessages([{
      ...initialWelcomeMessage,
      id: Date.now()
    }]);
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const res = await api.sendChatMessage(query.trim(), userSkills, user?.role || '', messages);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.reply || 'I am here to guide your career path!',
        prompts: res.suggested_prompts || []
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error', err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: '⚠️ I encountered a network issue communicating with the AI service. Please try again.',
        prompts: []
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`flex flex-col bg-slate-950/95 rounded-2xl border border-slate-800/90 overflow-hidden shadow-2xl backdrop-blur-xl ${
      isFloating ? 'h-[550px] w-full max-w-md' : 'h-[680px] max-w-5xl mx-auto my-6'
    }`}>
      
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">AI Career Coach</h3>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>Gemini AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Careers, Resumes, Java/Python, Skill Gaps & Interviews</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearChat}
            title="Clear Conversation History"
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Clear</span>
          </button>

          {isFloating && onCloseFloating && (
            <button
              onClick={onCloseFloating}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Body Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/70">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                : 'bg-slate-900 text-cyan-400 border border-slate-800'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[80%] space-y-3 ${
              msg.sender === 'user' ? 'text-right' : ''
            }`}>
              <div className={`p-4 rounded-2xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed inline-block text-left ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-100 shadow-md'
              }`}>
                {msg.text}
              </div>

              {/* Suggested Quick Prompts */}
              {msg.prompts && msg.prompts.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {msg.prompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 hover:bg-cyan-500/10 text-cyan-300 text-xs font-semibold transition-all shadow-sm"
                    >
                      💡 {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-2 text-xs text-cyan-300">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Gemini AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Controls Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask AI Career Coach (e.g. 60-day roadmap, daily preparation tasks)..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white disabled:opacity-50 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
