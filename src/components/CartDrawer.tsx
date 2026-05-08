import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { items, removeItem, total, count, isOpen, setIsOpen } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[360px] bg-dark-900 border-l border-dark-700/50 z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-700/50">
          <div className="flex items-center gap-2">
            <i className="ri-shopping-cart-line text-gold-400 w-5 h-5 flex items-center justify-center" />
            <h2 className="text-white font-semibold text-base">
              Your Cart
            </h2>
            <span className="bg-gold-500 text-dark-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {count}
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <i className="ri-shopping-cart-line text-white/20 text-4xl w-10 h-10 flex items-center justify-center mb-3" />
              <p className="text-white/40 text-sm">Your cart is empty.</p>
              <p className="text-white/30 text-xs mt-1">
                Add a robot to get started.
              </p>
              <a
                href="https://wa.me/2348145375816"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-gold-400 hover:text-gold-500 text-xs font-medium flex items-center gap-1"
              >
                <i className="ri-whatsapp-line w-3 h-3 flex items-center justify-center" />
                Contact on WhatsApp
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.robot.id}
                  className="flex gap-3 bg-dark-800/60 border border-dark-700/30 rounded-lg p-3"
                >
                  <img
                    src={item.robot.image}
                    alt={item.robot.name}
                    className="w-16 h-16 rounded-md object-cover object-top shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white text-sm font-medium truncate">
                      {item.robot.name}
                    </h4>
                    <p className="text-white/40 text-[10px] mb-1">
                      {item.robot.category} · ₦{item.robot.dailyReturn.toLocaleString()}/day
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gold-400 text-sm font-semibold">
                        ₦{item.robot.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeItem(item.robot.id)}
                        className="text-white/30 hover:text-red-400 text-[10px] flex items-center gap-1 transition-colors"
                      >
                        <i className="ri-delete-bin-line w-3 h-3 flex items-center justify-center" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-dark-700/50 bg-dark-900">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/50 text-sm">Total</span>
              <span className="text-white font-bold text-lg">
                ₦{total.toLocaleString()}
              </span>
            </div>
            <Link
              to="/sign-up"
              onClick={() => setIsOpen(false)}
              className="w-full bg-gold-500 hover:bg-gold-600 text-dark-900 font-semibold py-2.5 rounded-md text-sm flex items-center justify-center gap-2 transition-colors"
            >
              Proceed to Checkout
              <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
            </Link>
            <p className="text-white/30 text-[10px] text-center mt-2">
              You'll sign up and complete payment to activate your AI.
            </p>
          </div>
        )}
      </div>
    </>
  );
}