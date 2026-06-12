"use client";

import axios from "axios";
import { Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type message = {
  bookingId: string;
  sender: "user" | "driver";
  text: string;
  createdAt: Date;
};

function RideChat({ currentRole, bookingId, userName, driverName }: any) {
  const otherName = currentRole === "user" ? driverName : userName;
  const myName = currentRole === "user" ? userName : driverName;

  const [messages, setMessages] = useState<message[]>([]);
  const [lastMessage, setLastMessage] = useState("");
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showAI, setShowAI] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);

  const { userData } = useSelector((state: RootState) => state.user);

  const sendMsg = async () => {
    try {
      const { data } = await axios.post("/api/chat/send", {
        sender: currentRole,
        text,
        bookingId,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllMsg = async () => {
    try {
      const { data } = await axios.post("/api/chat/get-all", {
        bookingId,
      });
      console.log(data);
      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("RideChat mounted");
    if (bookingId) {
      getAllMsg();
    }
  }, []);

  const getAiSuggestions = async () => {
    // setAiLoading(true);
    setShowAI(true);
    try {
      const { data } = await axios.post("/api/chat/ai-suggestions", {
        lastMessage,
        role: currentRole,
      });
      console.log(data);
      setSuggestions(data);
      // setAiLoading(false);
    } catch (error) {
      console.log(error);
      // setAiLoading(false);
    }
  };

  const formatTime = (dateInput: Date | string) => {
    const date = new Date(dateInput);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-2xl overflow-hidden border border-zinc-100">
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-white border-b border-zinc-100">
        <div className="shrink-0 relative">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 flex items-center justify-center text-white text-xs font-bold">
            {otherName.charAt(0).toUpperCase()}
          </div>

          <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-400 w-2.5 h-2.5 rounded-full border-2 border-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-zinc-900 leading-none">
            {otherName}{" "}
          </p>
          <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">
            Active Now
          </p>
        </div>
      </div>

      <div
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 bg-zinc-50"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`div::-webkit-scrollbar {display:none}`}</style>

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <Send className="text-zinc-400" size={18} />
            </div>

            <p className="text-sm text-zinc-400 font-medium">No Messages Yet</p>
            <p className="text-xs text-zinc-300">
              Start the conversation below
            </p>
          </div>
        )}

        {messages.length > 0 &&
          messages.map((m, i) => {
            const isMine = m.sender.toString() === userData?._id.toString();
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl shadow-sm ${isMine ? "bg-zinc-950 text-white rounded-br-sm" : "bg-white border-zinc-200 text-zinc-900 rounded-bl-sm"}`}
                >
                  <p className="wrap-break-word">{m.text}</p>
                  <span className="text-10">{formatTime(m.createdAt)}</span>
                </div>
              </motion.div>
            );
          })}
      </div>

      <AnimatePresence>
        {showAI && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="shrink-0 border-t border-zinc-100 bg-white"
          >
            <div className="px-4 pt-3 pb-2 max-h-40 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={12} className="text-violet-500" />
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    AI Suggestions
                  </span>
                </div>
                <button onClick={() => setShowAI(false)}>
                  <X className="text-zinc-400 hover:text-zinc-600" size={14} />
                </button>
              </div>

              {aiLoading ? (
                <div className="flex flex-col gap-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-9 bg-zinc-100 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {suggestions.map((s, i) => (
                    <motion.div
                      key={i}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setText(s);
                        setShowAI(false);
                      }}
                      className="text-left text-sm text-zinc-700 bg-zinc-50 hover:bg-violet-50 hover:text-violet-700 border border-zinc-100 hover:border-violet-200 px-3 py-2 rounded-xl transition-all"
                    >
                      {s}
                    </motion.div>
                  ))}

                  <button className="text-[11px] text-violet-500 hover:text-violet-700 font-semibold text-center mt-1 transition-colors">
                    Refresh Suggestions
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="shrink-0 px-4 pb-4 pt-2 bg-red-500">
        <div className="flex items-center gap-2 bg-zinc-100 rounded-2xl pl-3 pr-1.5 py-1.5">
          {messages.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => getAiSuggestions()}
              className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${showAI ? "bg-violet-600 text-white" : "bg-white text-violet-500 border border-zinc-200"}`}
            >
              <Sparkles size={14} />
            </motion.button>
          )}

          <input
            type="text"
            className="flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none py-1.5 min-w-0"
            placeholder="Message..."
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
        </div>
      </div>

      <div className="bg-red-500 p-4">INPUT TEST</div>
    </div>
  );
}

export default RideChat;
