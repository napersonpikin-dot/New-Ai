import { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  from: 'user' | 'support';
  text: string;
  time: string;
}

const faqReplies: Record<string, string> = {
  'hi': 'Hello! Welcome to Ai EARNERS support. How can I help you today?',
  'hello': 'Hello! Welcome to Ai EARNERS support. How can I help you today?',
  'hey': 'Hey there! Welcome to Ai EARNERS. What do you need help with?',
  'deposit': 'To make a deposit, go to your Dashboard and click "Deposit". You will receive payment instructions via email after submitting.',
  'withdraw': 'To withdraw, go to your Dashboard and click "Withdraw". Minimum withdrawal is ₦5,000. Processing time is 2-24 hours.',
  'withdrawal': 'To withdraw, go to your Dashboard and click "Withdraw". Minimum withdrawal is ₦5,000. Processing time is 2-24 hours.',
  'robot': 'You can activate AI robots by contacting our customer service on WhatsApp at +234 814 537 5816. Available robots: AlphaBot Pro (₦10,000), YieldMaster X (₦21,000), CryptoMiner AI (₦50,000).',
  'robot': 'We have 3 active AI robots: AlphaBot Pro (₦10,000, earns ₦2,000/day), YieldMaster X (₦21,000, earns ₦6,000/day), and CryptoMiner AI (₦50,000, earns ₦29,000/day).',
  'price': 'Current prices: AlphaBot Pro ₦10,000 | YieldMaster X ₦21,000 | CryptoMiner AI ₦50,000. More robots coming soon!',
  'login': 'If you are having trouble logging in, make sure you are using the correct email and password. You can also contact us on WhatsApp for quick help.',
  'signup': 'To sign up, create your free account on the Sign Up page. Then activate an AI robot to start earning.',
  'referral': 'Share your referral code from the Referral page. You earn a bonus every time someone signs up with your code and activates a robot.',
  'loan': 'Loan applications are available from your Dashboard. Click "Apply for Loan" and fill out the form. Approval usually takes 1-3 business days.',
  'contact': 'You can reach us via WhatsApp at +234 814 537 5816 or email support@aiearners.com. We usually respond within 2 hours.',
  'help': 'I can help with deposits, withdrawals, robots, referrals, loans, and login issues. What do you need?',
};

function getReply(text: string): string | null {
  const lower = text.toLowerCase().trim();
  for (const key of Object.keys(faqReplies)) {
    if (lower.includes(key)) return faqReplies[key];
  }
  return null;
}

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: 'support',
      text: 'Hi! I am your Ai EARNERS support assistant. Ask me about deposits, withdrawals, robots, or anything else!',
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now(),
      from: 'user',
      text,
      time: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const reply = getReply(text);
    const delay = reply ? 800 : 1200;

    setTimeout(() => {
      setTyping(false);
      const supportText = reply
        ? reply
        : "I am not sure about that. For faster help, please contact our human support on WhatsApp: +234 814 537 5816 or email support@aiearners.com.";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'support',
          text: supportText,
          time: getTime(),
        },
      ]);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gold-500 hover:bg-gold-600 text-dark-900 shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        aria-label="Open support chat"
      >
        {open ? (
          <i className="ri-close-line text-xl w-6 h-6 flex items-center justify-center" />
        ) : (
          <i className="ri-customer-service-2-line text-xl w-6 h-6 flex items-center justify-center" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-dark-800 border border-dark-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gold-500 px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-dark-900/20 flex items-center justify-center">
              <i className="ri-customer-service-2-line text-dark-900 w-5 h-5 flex items-center justify-center" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-dark-900 font-semibold text-sm truncate">Customer Care</h4>
              <p className="text-dark-900/60 text-[10px]">Ai EARNERS Support</p>
            </div>
            <a
              href="https://wa.me/2348145375816"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center hover:bg-emerald-500/30 transition-colors"
              title="Chat on WhatsApp"
            >
              <i className="ri-whatsapp-line text-emerald-700 w-4 h-4 flex items-center justify-center" />
            </a>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[280px] max-h-[380px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-gold-500 text-dark-900 rounded-br-sm'
                      : 'bg-dark-700/60 text-white/90 rounded-bl-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[10px] mt-1 block ${
                      msg.from === 'user' ? 'text-dark-900/50' : 'text-white/30'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-dark-700/60 px-3 py-2 rounded-xl rounded-bl-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-dark-700/50 shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                className="flex-1 bg-dark-900 border border-dark-700/50 rounded-full px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-dark-900 flex items-center justify-center transition-colors shrink-0"
                aria-label="Send message"
              >
                <i className="ri-send-plane-fill w-4 h-4 flex items-center justify-center" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-[10px] text-white/20">Need human support?</span>
              <a
                href="https://wa.me/2348145375816"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <i className="ri-whatsapp-line w-3 h-3 flex items-center justify-center" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}