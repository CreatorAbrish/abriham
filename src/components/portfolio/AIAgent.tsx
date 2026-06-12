import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config";

const AgentVisual = lazy(() => import("./AgentVisual"));

const SUGGESTIONS = [
  "Tell me about Darcho",
  "What makes Abriham's work different?",
  "How can we work together?",
  "Show me the digital menu project",
];

export default function AIAgent() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error } = useChat({ transport });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const isBusy = status === "submitted" || status === "streaming";
  const active = isBusy || messages.length > 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = (text: string) => {
    if (!text.trim() || isBusy) return;
    sendMessage({ text: text.trim() });
    setInput("");
  };

  // Listen for "Discuss with Kere" triggers from project cards.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ prompt: string }>).detail;
      if (!detail?.prompt) return;
      document.getElementById("agent")?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => sendMessage({ text: detail.prompt }), 350);
    };
    window.addEventListener("discuss-with-kere", handler as EventListener);
    return () => window.removeEventListener("discuss-with-kere", handler as EventListener);
  }, [sendMessage]);

  return (
    <section id="agent" className="relative mx-auto max-w-7xl px-6 py-32 md:px-12">
      <div className="mb-12 max-w-3xl">
        <div className="text-mono mb-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          ✦ Conversational layer
        </div>
        <h2 className="text-display text-[clamp(2.5rem,6vw,5rem)] font-medium">
          Meet <span className="italic font-light text-gradient-gold">Kere</span>.
        </h2>
        <p className="mt-6 text-base text-muted-foreground md:text-lg">
          Kere is Abriham's portfolio AI — trained on every project, decision, and outcome. Ask anything.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Chat */}
        <div className="lg:col-span-3 relative overflow-hidden rounded-3xl glass-panel shimmer-border">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-3 text-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inset-0 rounded-full ${isBusy ? "animate-ping bg-primary" : ""}`} />
                <span className="relative h-2 w-2 rounded-full bg-primary" />
              </span>
              kere@kassa.dev — online
            </div>
            <div>v1.0</div>
          </div>

          <div
            ref={scrollRef}
            className="h-[28rem] overflow-y-auto px-5 py-6 text-sm md:h-[32rem]"
          >
            {messages.length === 0 && (
              <div className="text-foreground/90">
                <span className="text-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                  kere
                </span>
                <p className="mt-2 leading-relaxed cursor-caret">{siteConfig.aiAgent.greeting}</p>
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((m) => {
                const text = m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                const isUser = m.role === "user";
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5"
                  >
                    <div className="text-mono text-[10px] uppercase tracking-[0.3em]">
                      <span className={isUser ? "text-muted-foreground" : "text-primary"}>
                        {isUser ? "you" : "kere"}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap leading-relaxed text-foreground/90">
                      {text}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {status === "submitted" && (
              <div className="mt-5">
                <div className="text-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                  kere
                </div>
                <div className="mt-2 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="mt-5 text-mono text-xs text-destructive">
                Kere hit a snag — please try again in a moment.
              </p>
            )}
          </div>

          {/* Suggestions */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 border-t border-border/60 px-5 py-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  data-cursor="hover"
                  className="rounded-full border border-border bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="flex items-center gap-2 border-t border-border/60 px-3 py-3"
          >
            <span className="text-mono pl-2 text-xs text-primary">{">"}</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Kere anything…"
              className="text-mono flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              disabled={isBusy || !input.trim()}
              data-cursor="hover"
              className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition disabled:opacity-40"
            >
              {isBusy ? "…" : "Send ↵"}
            </button>
          </form>
        </div>

        {/* Visual */}
        <div className="relative h-[24rem] overflow-hidden rounded-3xl glass-panel lg:col-span-2 lg:h-auto">
          <Suspense fallback={null}>
            <AgentVisual active={active} />
          </Suspense>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
            <div className="text-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {isBusy ? "✦ Kere is thinking" : active ? "✦ Listening" : "✦ Idle"}
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,transparent,oklch(0.07_0.005_60)_75%)]" />
        </div>
      </div>
    </section>
  );
}
