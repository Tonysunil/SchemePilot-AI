'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Plus, MessageSquare, Menu, Paperclip, Loader2, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createClient } from '@/utils/supabase/client';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Namaste! I am SchemePilot AI. I can help you find government schemes you are eligible for. Tell me a bit about yourself (e.g., your state, occupation, age, and family income).',
    }
  ]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch user profile on load
  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        let name = user?.user_metadata?.full_name;
        if (!name && user?.email) {
          const emailPrefix = user.email.split('@')[0];
          const match = emailPrefix.match(/[a-zA-Z]+/);
          name = match ? match[0] : emailPrefix;
          name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        }
        
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setUserProfile({ ...(data || {}), full_name: name });
        
        // Update greeting message
        setMessages(prev => {
          const newMsgs = [...prev];
          if (newMsgs[0].id === '1' && name) {
            newMsgs[0].content = `Namaste, ${name}! I am SchemePilot AI. I can help you find government schemes you are eligible for. Tell me a bit about yourself (e.g., your state, occupation, age, and family income).`;
          }
          return newMsgs;
        });
      }
    }
    loadProfile();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleListen = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Input. Please try using Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Indian English

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev ? prev + ' ' + transcript : transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: `Uploaded Document: ${file.name}`
    }]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/v1/ocr`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      const reply = `**Document OCR & Validation Complete**\n- **Type:** ${data.document_type}\n- **Validation:** ${data.validation}\n- **Extracted Data:** \n\`\`\`json\n${JSON.stringify(data.extracted_data, null, 2)}\n\`\`\``;
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Error uploading document. Is the backend running?'
      }]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    const currentInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    const currentLocale = match ? match[2] : 'en';

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentInput, 
          history: messages, 
          user_profile: userProfile || {},
          language: currentLocale
        })
      });
      
      if (!res.ok) throw new Error('Network error');
      
      const data = await res.json();
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply
      }]);
    } catch (error) {
      setInput(currentInput); // Restore the user's drafted message
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I am having trouble connecting to the server. Please ensure the backend is running.'
      }]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden">
      {/* Sidebar */}
      <div className={`border-r border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 opacity-0'} flex flex-col hidden md:flex`}>
        <div className="p-4 border-b border-white/10">
          <Button variant="outline" className="w-full justify-start rounded-xl bg-white/5 border-white/10 hover:bg-white/10" onClick={() => setMessages([])}>
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            <Button variant="ghost" className="w-full justify-start font-normal text-muted-foreground hover:text-foreground">
              <MessageSquare className="mr-2 h-4 w-4" />
              Student Scholarship
            </Button>
            <Button variant="ghost" className="w-full justify-start font-normal text-muted-foreground hover:text-foreground">
              <MessageSquare className="mr-2 h-4 w-4" />
              Farmer Subsidies
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full min-w-0 overflow-hidden">
        <div className="md:hidden p-4 border-b border-white/10 flex items-center bg-background/80 backdrop-blur-sm z-10 absolute top-0 w-full">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold ml-2">SchemePilot AI Chat</span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 pt-16 md:pt-4 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-6 pb-20">
            {messages.map((m) => (
              <motion.div 
                key={m.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <Avatar className="h-8 w-8 mt-1 border border-indigo-500/30">
                    <AvatarFallback className="bg-indigo-600 text-white"><Bot size={16} /></AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[80%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/5 border border-white/10'}`}>
                  {m.role === 'user' ? (
                    m.content
                  ) : (
                    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-td:border prose-th:border prose-th:bg-white/10 prose-td:border-white/10 prose-th:border-white/10 prose-table:w-full prose-table:border-collapse prose-th:p-2 prose-td:p-2 text-sm md:text-base">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {m.role === 'user' && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-zinc-800 text-white"><User size={16} /></AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background/80 backdrop-blur-md border-t border-white/10 w-full shrink-0">
          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept=".pdf,.png,.jpg,.jpeg" 
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute left-2 h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about schemes or attach a document..."
                className="pl-14 pr-24 py-6 rounded-2xl bg-white/5 border-white/10 focus-visible:ring-indigo-500"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <Button 
                  type="button" 
                  size="icon"
                  variant="ghost" 
                  onClick={toggleListen}
                  className={`h-10 w-10 rounded-xl transition-colors ${isListening ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
                  title="Voice Input"
                >
                  <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
                </Button>
                <Button 
                  type="submit" 
                  size="icon" 
                  className="h-10 w-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
                  disabled={!input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
            <div className="text-xs text-center text-muted-foreground mt-2">
              SchemePilot AI can make mistakes. Consider verifying official government portals.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
