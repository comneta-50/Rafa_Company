"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Terminal,
  RotateCw,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: "Halo! Saya adalah AI Chatbot Rafa Company. Ada yang bisa saya bantu hari ini?",
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || isTyping) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Panggil backend root endpoint atau simulasi jawaban chatbot
      let botReply = "";
      try {
        const res = await fetch("https://rafa-backend-worker.rafa-ai.workers.dev/");
        if (res.ok) {
          const rootText = await res.text();
          botReply = `Pesan dari server: "${rootText}". Saya menerima pesan Anda: "${query}". Bagaimana saya dapat membantu Anda lebih lanjut?`;
        } else {
          botReply = `Saya menerima pertanyaan Anda: "${query}". Bagaimana saya dapat membantu Anda?`;
        }
      } catch (err) {
        botReply = `Terima kasih! Saya menerima input Anda: "${query}". Sistem AI siap membantu kebutuhan Anda.`;
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botReply,
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      toast.error("Gagal mengirim pesan.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Teks berhasil disalin!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "msg-1",
        sender: "bot",
        text: "Halo! Percakapan baru telah dimulai. Ada yang bisa saya bantu?",
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    toast.success("Riwayat chat dibersihkan.");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#F5F5F6]">
      {/* Top Header */}
      <header className="h-16 border-b border-[#E7E5E4] bg-white px-6 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-[#881337] flex items-center justify-center text-white shadow-xs">
            <Bot className="size-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[#1C1917] flex items-center gap-2">
              Rafa AI Chatbot
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Ready
              </span>
            </h1>
            <p className="text-[11px] text-[#78716C]">
              Asisten AI interaktif untuk konsultasi dan tanya jawab
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="text-xs h-8"
        >
          <RotateCw className="size-3.5 mr-1.5" />
          Mulai Ulang
        </Button>
      </header>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((m) => {
            const isBot = m.sender === "bot";

            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${
                  isBot ? "justify-start" : "justify-end"
                }`}
              >
                {isBot && (
                  <div className="size-8 rounded-lg bg-[#881337] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="size-4" />
                  </div>
                )}

                <div
                  className={`relative group max-w-[80%] rounded-xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                    isBot
                      ? "bg-white text-[#1C1917] border border-[#E7E5E4]"
                      : "bg-[#881337] text-white"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <div
                    className={`flex items-center justify-between gap-4 mt-2 pt-1 border-t ${
                      isBot
                        ? "border-[#E7E5E4] text-[#A8A29E]"
                        : "border-white/20 text-white/70"
                    } text-[10px] font-mono`}
                  >
                    <span>{m.timestamp}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(m.id, m.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-90"
                      title="Salin teks"
                    >
                      {copiedId === m.id ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  </div>
                </div>

                {!isBot && (
                  <div className="size-8 rounded-lg bg-[#1C1917] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                    <User className="size-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-lg bg-[#881337] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                <Bot className="size-4" />
              </div>
              <div className="bg-white border border-[#E7E5E4] rounded-xl px-4 py-3 text-xs shadow-xs flex items-center gap-1.5 text-[#78716C]">
                <span className="size-2 rounded-full bg-[#881337] animate-bounce" />
                <span className="size-2 rounded-full bg-[#881337] animate-bounce [animation-delay:0.2s]" />
                <span className="size-2 rounded-full bg-[#881337] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1.5 font-mono">
                  Mengetik respon...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form Bar */}
      <div className="border-t border-[#E7E5E4] bg-white p-4 shrink-0 shadow-lg">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pesan pertanyaan atau instruksi di sini..."
            className="flex-1 h-11 px-4 text-xs rounded-lg bg-[#FAF9F9] border border-[#E7E5E4] text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#881337]/30"
            disabled={isTyping}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="h-11 px-5 rounded-lg text-xs"
          >
            <Send className="size-4 mr-1.5" /> Kirim
          </Button>
        </form>
      </div>
    </div>
  );
}
