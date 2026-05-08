import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-800 border-t border-dark-700/50" aria-label="Site footer">
      <div className="px-4 md:px-6 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="lg:max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="https://static.readdy.ai/image/e514fc972d3ac011ec046bb027a8bd60/05b8712378af54b96f49b8eeeac4fc04.png"
                alt="Ai EARNERS Logo"
                className="w-7 h-7 object-contain"
              />
              <span className="text-white font-bold text-base tracking-tight">
                Ai <span className="text-gold-400">EARNERS</span>
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              The leading platform to purchase AI robots that generate daily passive income. Start small, scale your fleet, and earn 24/7.
            </p>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <i className="ri-shield-check-line w-4 h-4 flex items-center justify-center" />
                Secure Platform
              </span>
              <span className="flex items-center gap-1">
                <i className="ri-global-line w-4 h-4 flex items-center justify-center" />
                Global Access
              </span>
            </div>
            {/* Social & Contact */}
            <div className="mt-5 space-y-2">
              <a
                href="https://wa.me/2348145375816"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/50 hover:text-emerald-400 transition-colors"
              >
                <i className="ri-whatsapp-line w-4 h-4 flex items-center justify-center" />
                +234 814 537 5816
              </a>
              <a
                href="mailto:support@aiearners.com"
                className="flex items-center gap-2 text-sm text-white/50 hover:text-gold-400 transition-colors"
              >
                <i className="ri-mail-line w-4 h-4 flex items-center justify-center" />
                support@aiearners.com
              </a>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://wa.me/2348145375816"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-dark-700/50 hover:bg-emerald-500/20 flex items-center justify-center text-white/50 hover:text-emerald-400 transition-all"
                aria-label="WhatsApp"
              >
                <i className="ri-whatsapp-line w-4 h-4 flex items-center justify-center" />
              </a>
              <a
                href="https://t.me/AiEarnersSupport"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-dark-700/50 hover:bg-sky-500/20 flex items-center justify-center text-white/50 hover:text-sky-400 transition-all"
                aria-label="Telegram"
              >
                <i className="ri-telegram-line w-4 h-4 flex items-center justify-center" />
              </a>
              <a
                href="https://facebook.com/AiEarners"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-dark-700/50 hover:bg-blue-500/20 flex items-center justify-center text-white/50 hover:text-blue-400 transition-all"
                aria-label="Facebook"
              >
                <i className="ri-facebook-circle-line w-4 h-4 flex items-center justify-center" />
              </a>
              <a
                href="https://instagram.com/AiEarners"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-dark-700/50 hover:bg-pink-500/20 flex items-center justify-center text-white/50 hover:text-pink-400 transition-all"
                aria-label="Instagram"
              >
                <i className="ri-instagram-line w-4 h-4 flex items-center justify-center" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-1">
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-sm text-white/50 hover:text-gold-400 transition-colors">Home</Link>
                <Link to="/#features" className="text-sm text-white/50 hover:text-gold-400 transition-colors">Features</Link>
                <Link to="/dashboard" className="text-sm text-white/50 hover:text-gold-400 transition-colors">Dashboard</Link>
                <a
                  href="https://wa.me/2348145375816"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-gold-400 transition-colors"
                >
                  Robot Marketplace
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Earn</h4>
              <div className="flex flex-col gap-2">
                <a
                  href="https://wa.me/2348145375816"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-gold-400 transition-colors"
                >
                  Activate AI
                </a>
                <Link to="/dashboard" className="text-sm text-white/50 hover:text-gold-400 transition-colors">Earnings Dashboard</Link>
                <Link to="/#member" className="text-sm text-white/50 hover:text-gold-400 transition-colors">Member Portal</Link>
                <Link to="/referral" className="text-sm text-white/50 hover:text-gold-400 transition-colors">Referral Program</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Support & Legal</h4>
              <div className="flex flex-col gap-2">
                <Link to="/contact" className="text-sm text-white/50 hover:text-gold-400 transition-colors">Help Center</Link>
                <Link to="/contact" className="text-sm text-white/50 hover:text-gold-400 transition-colors">Terms of Service</Link>
                <Link to="/contact" className="text-sm text-white/50 hover:text-gold-400 transition-colors">Privacy Policy</Link>
                <Link to="/contact" className="text-sm text-white/50 hover:text-gold-400 transition-colors">Contact Support</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-700/50 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30 text-center sm:text-left">
            &copy; {currentYear} Ai EARNERS. All rights reserved.
          </p>
          <p className="text-xs text-white/30 text-center sm:text-left">
            Ai EARNERS — Own AI Robots. Earn Daily.
          </p>
        </div>
      </div>
    </footer>
  );
}
