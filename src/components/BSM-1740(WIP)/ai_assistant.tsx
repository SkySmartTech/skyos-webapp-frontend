import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Send, Search, FileText, BarChart, Zap } from "lucide-react";

type Message = { id: number; from: "ai" | "user"; text: string };

export default function AiAssistant() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: "ai", text: "Hello! How can I assist you with the supermarket system today?" },
  ]);
  const [input, setInput] = useState("");
  const scroller = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send() {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), from: "user", text: input.trim() };
    setMessages((s) => [...s, userMsg]);
    setInput("");
    setTimeout(() => {
      const reply: Message = { id: Date.now() + 1, from: "ai", text: "I can help with reports, inventory queries, or trend analysis. What would you like to do?" };
      setMessages((s) => [...s, reply]);
    }, 700);
  }

  const container = dark ? "bg-[#070707] text-white" : "bg-white text-slate-900";
  const card = dark ? "border-white/10 bg-[#0e0e0e]" : "border-slate-200 bg-white";

  return (
    <div className={`flex h-full gap-6 p-6 ${container}`}>
      <div className="flex w-full flex-col gap-4">
        <div className={`rounded-2xl border px-6 py-5 ${card}`}>
          <h2 className="text-2xl font-bold">AI Assistant</h2>
          <p className="mt-1 text-sm text-slate-400">Get intelligent help with your tasks</p>
        </div>

        <div className={`flex-1 rounded-2xl border ${card} flex overflow-hidden`}>
          <div className="flex-1 flex flex-col">
            <div ref={scroller} className="flex-1 overflow-y-auto p-6">
              {messages.map((m) => (
                <div key={m.id} className={`mb-4 flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[72%] rounded-xl px-4 py-3 text-sm ${m.from === "user" ? "bg-orange-500 text-white" : "bg-white/5 text-slate-200 border border-white/5"}`}>{m.text}</div>
                </div>
              ))}
            </div>

            <div className="border-t p-4">
              <div className="flex items-center gap-3">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type your message..." className="flex-1 rounded-xl border px-4 py-3 bg-transparent text-sm outline-none" />
                <button onClick={send} className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white" aria-label="Send"><Send size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="w-[320px] shrink-0">
        <div className={`rounded-2xl border p-4 ${card} mb-4`}>
          <h3 className="font-semibold">Quick Actions</h3>
          <ul className="mt-3 space-y-2">
            <li className="flex items-center gap-3 rounded-md border px-3 py-2"><Search size={14} /> <span className="text-sm">Search Database</span></li>
            <li className="flex items-center gap-3 rounded-md border px-3 py-2"><FileText size={14} /> <span className="text-sm">Generate Report</span></li>
            <li className="flex items-center gap-3 rounded-md border px-3 py-2"><BarChart size={14} /> <span className="text-sm">Analyze Trends</span></li>
            <li className="flex items-center gap-3 rounded-md border px-3 py-2"><Zap size={14} /> <span className="text-sm">Data Insights</span></li>
          </ul>
        </div>

        <div className={`rounded-2xl border p-4 ${card}`}>
          <h3 className="font-semibold">AI Capabilities</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>Natural language queries</li>
            <li>Data analysis &amp; insights</li>
            <li>Report generation</li>
            <li>Trend predictions</li>
            <li>Task automation</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
