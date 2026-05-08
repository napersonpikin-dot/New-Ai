import { useState, useEffect } from 'react';

export default function WhatsAppFAB() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-5 z-[70] transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <a
        href="https://wa.me/2348145375816"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 bg-[#25D366] hover:bg-[#1EBE57] text-white rounded-full pl-4 pr-1.5 py-1.5 shadow-none transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <span className="text-sm font-semibold whitespace-nowrap hidden sm:inline-block">
          Chat on WhatsApp
        </span>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <i className="ri-whatsapp-line text-white text-xl w-6 h-6 flex items-center justify-center" />
        </div>
      </a>

      {/* Small tooltip above */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-dark-800 text-white text-xs px-3 py-1.5 rounded-md whitespace-nowrap border border-white/10">
          Need help? Chat with us
        </div>
      </div>
    </div>
  );
}