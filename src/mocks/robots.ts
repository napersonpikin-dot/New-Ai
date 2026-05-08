export interface Robot {
  id: number;
  name: string;
  category: string;
  price: number;
  dailyReturn: number;
  image: string;
  badge: string;
  features: string[];
  rating: number;
  reviews: number;
  roiDays: number;
  comingSoon?: boolean;
}

export const robots: Robot[] = [
  {
    id: 1,
    name: 'AlphaBot Pro',
    category: 'Trading',
    price: 10000,
    dailyReturn: 2000,
    image: 'https://readdy.ai/api/search-image?query=A%20futuristic%20golden%20and%20black%20humanoid%20robot%20with%20glowing%20amber%20eyes%20standing%20confidently%20against%20a%20dark%20minimal%20background%2C%20sleek%20metallic%20body%20with%20LED%20accents%2C%203D%20render%20style%2C%20dramatic%20studio%20lighting%2C%20high%20detail%2C%20cinematic%20atmosphere&width=400&height=400&seq=101&orientation=squarish',
    badge: 'Best Seller',
    features: ['AI Trading Engine', '24/7 Market Analysis', 'Auto-Reinvestment'],
    rating: 4.9,
    reviews: 1240,
    roiDays: 5,
  },
  {
    id: 2,
    name: 'YieldMaster X',
    category: 'DeFi',
    price: 21000,
    dailyReturn: 6000,
    image: 'https://readdy.ai/api/search-image?query=A%20sleek%20futuristic%20robot%20with%20a%20dark%20metallic%20body%20and%20golden%20circuit%20patterns%2C%20standing%20on%20a%20minimal%20dark%20background%20with%20soft%20amber%20lighting%2C%20high-tech%20autonomous%20machine%2C%203D%20render%2C%20clean%20and%20modern%20aesthetic&width=400&height=400&seq=102&orientation=squarish',
    badge: 'Top Earner',
    features: ['Yield Farming Bot', 'Multi-Protocol', 'Risk Management'],
    rating: 4.8,
    reviews: 890,
    roiDays: 4,
  },
  {
    id: 3,
    name: 'CryptoMiner AI',
    category: 'Mining',
    price: 50000,
    dailyReturn: 29000,
    image: 'https://readdy.ai/api/search-image?query=A%20compact%20futuristic%20mining%20robot%20with%20glowing%20golden%20core%20and%20dark%20armor%20plating%2C%20minimal%20dark%20studio%20background%2C%20soft%20amber%20rim%20lighting%2C%20detailed%203D%20render%2C%20industrial%20yet%20elegant%20design&width=400&height=400&seq=103&orientation=squarish',
    badge: 'Elite Pick',
    features: ['Auto-Mining Engine', 'Pool Optimization', 'Energy Efficient'],
    rating: 4.7,
    reviews: 2100,
    roiDays: 2,
  },
  {
    id: 4,
    name: 'ArbitrageBot Elite',
    category: 'Arbitrage',
    price: 0,
    dailyReturn: 0,
    image: 'https://readdy.ai/api/search-image?query=A%20premium%20futuristic%20robot%20with%20elegant%20dark%20chrome%20finish%20and%20golden%20accents%2C%20sophisticated%20autonomous%20machine%2C%20minimal%20dark%20background%20with%20warm%20amber%20lighting%2C%203D%20render%2C%20luxury%20tech%20aesthetic%2C%20high%20detail&width=400&height=400&seq=104&orientation=squarish',
    badge: 'Coming Soon',
    features: ['Cross-Exchange', 'Microsecond Speed', 'Smart Routing'],
    rating: 4.9,
    reviews: 0,
    roiDays: 0,
    comingSoon: true,
  },
  {
    id: 5,
    name: 'LiquidityBot Core',
    category: 'Liquidity',
    price: 0,
    dailyReturn: 0,
    image: 'https://readdy.ai/api/search-image?query=A%20robust%20futuristic%20robot%20with%20dark%20matte%20finish%20and%20golden%20LED%20strips%2C%20powerful%20autonomous%20machine%20design%2C%20minimal%20dark%20background%20with%20soft%20warm%20lighting%2C%203D%20render%2C%20industrial%20modern%20aesthetic&width=400&height=400&seq=105&orientation=squarish',
    badge: 'Coming Soon',
    features: ['LP Management', 'Impermanent Loss Guard', 'Auto-Rebalance'],
    rating: 4.6,
    reviews: 0,
    roiDays: 0,
    comingSoon: true,
  },
  {
    id: 6,
    name: 'SignalBot Prime',
    category: 'Signals',
    price: 0,
    dailyReturn: 0,
    image: 'https://readdy.ai/api/search-image?query=A%20sleek%20compact%20futuristic%20robot%20with%20translucent%20golden%20panels%20and%20dark%20inner%20chassis%2C%20minimal%20dark%20studio%20background%2C%20warm%20amber%20glow%2C%203D%20render%2C%20modern%20elegant%20design%2C%20high%20detail&width=400&height=400&seq=106&orientation=squarish',
    badge: 'Coming Soon',
    features: ['Signal Generation', 'Backtesting Engine', 'Alert System'],
    rating: 4.5,
    reviews: 0,
    roiDays: 0,
    comingSoon: true,
  },
];

export const features = [
  {
    icon: 'ri-robot-2-line',
    title: 'AI-Powered Robots',
    description: 'Our robots use advanced machine learning algorithms to maximize your daily returns with zero manual effort.',
  },
  {
    icon: 'ri-bar-chart-grouped-fill',
    title: 'Real-Time Analytics',
    description: 'Track your earnings, robot performance, and portfolio growth with a live dashboard updated every second.',
  },
  {
    icon: 'ri-shield-check-line',
    title: 'Secure & Verified',
    description: 'Every robot is audited, verified, and backed by our platform guarantee. Your investment is protected.',
  },
  {
    icon: 'ri-wallet-3-line',
    title: 'Instant Withdrawals',
    description: 'Withdraw your daily earnings to any bank, crypto wallet, or payment method — processed within minutes.',
  },
  {
    icon: 'ri-customer-service-2-line',
    title: '24/7 Support',
    description: 'Our dedicated support team is always available via live chat, email, or Telegram to help you succeed.',
  },
  {
    icon: 'ri-stack-line',
    title: 'Scalable Fleet',
    description: 'Start with one robot and scale your fleet over time. The more robots you own, the more you earn.',
  },
];

export const earningsData = [
  { day: 'Mon', earnings: 37000 },
  { day: 'Tue', earnings: 42100 },
  { day: 'Wed', earnings: 35800 },
  { day: 'Thu', earnings: 45200 },
  { day: 'Fri', earnings: 38900 },
  { day: 'Sat', earnings: 51000 },
  { day: 'Sun', earnings: 44800 },
];

export const weeklyEarningsData = [
  { week: 'W1', earnings: 264500 },
  { week: 'W2', earnings: 292800 },
  { week: 'W3', earnings: 281000 },
  { week: 'W4', earnings: 310400 },
];

export const memberStats = [
  { label: 'Total Robots Owned', value: '3', icon: 'ri-robot-2-line' },
  { label: 'Active Today', value: '3', icon: 'ri-flashlight-line' },
  { label: 'Total Invested', value: '₦81,000', icon: 'ri-money-dollar-circle-line' },
  { label: 'Lifetime Earnings', value: '₦380,000', icon: 'ri-coins-line' },
  { label: 'Available Balance', value: '₦45,200', icon: 'ri-wallet-3-line' },
  { label: 'Referral Bonus', value: '₦12,400', icon: 'ri-user-add-line' },
];

export const paymentMethods = [
  { name: 'Bank Transfer', icon: 'ri-bank-card-line' },
  { name: 'Crypto Wallet', icon: 'ri-coin-line' },
  { name: 'PayPal', icon: 'ri-paypal-line' },
  { name: 'Stripe', icon: 'ri-bank-card-2-line' },
  { name: 'Wise', icon: 'ri-safe-line' },
  { name: 'USDT / USDC', icon: 'ri-bit-coin-line' },
];

export const supportChannels = [
  { name: 'Live Chat', icon: 'ri-message-3-line', desc: 'Instant help from our team', available: '24/7' },
  { name: 'Email Support', icon: 'ri-mail-line', desc: 'Detailed responses within 2 hours', available: '24/7' },
  { name: 'Telegram Community', icon: 'ri-telegram-line', desc: 'Join 8,000+ members', available: '24/7' },
  { name: 'Help Center', icon: 'ri-book-open-line', desc: 'Guides, FAQs & tutorials', available: 'Always' },
];

export const testimonials = [
  {
    name: 'Michael T.',
    location: 'London, UK',
    text: 'I started with one AlphaBot Pro three months ago. Now I own five robots and earn over ₦57,000 per day passively. The dashboard makes everything crystal clear.',
    rating: 5,
    avatar: 'M',
  },
  {
    name: 'Sarah L.',
    location: 'Toronto, Canada',
    text: 'The earnings are consistent and withdrawals are instant. I have recommended Ai EARNERS to my entire network. The referral bonuses are a nice bonus too!',
    rating: 5,
    avatar: 'S',
  },
  {
    name: 'James K.',
    location: 'Sydney, Australia',
    text: 'As someone who tried many passive income platforms, Ai EARNERS is the only one that actually delivers. The robot marketplace has options for every budget.',
    rating: 5,
    avatar: 'J',
  },
];

export const faqItems = [
  {
    question: 'How do the AI robots generate daily income?',
    answer: 'Each AI robot is programmed to perform specialized automated tasks — such as trading, yield farming, or arbitrage — across decentralized and centralized platforms. The profits generated are distributed to robot owners as daily passive income.',
  },
  {
    question: 'Is there a minimum amount to start?',
    answer: 'No minimum commitment. You can start with a single robot priced from ₦10,000. Each robot is a one-time purchase with no recurring fees or hidden charges.',
  },
  {
    question: 'How quickly can I withdraw my earnings?',
    answer: 'Withdrawals are processed instantly for crypto wallets and within 24 hours for bank transfers. You can withdraw your available balance at any time with zero withdrawal fees.',
  },
  {
    question: 'Can I own multiple robots at once?',
    answer: 'Absolutely. Many members scale their income by owning multiple robots across different categories. Your earnings compound as your fleet grows.',
  },
  {
    question: 'Is my investment safe?',
    answer: 'Every robot on our platform is fully audited and verified. We also provide a platform protection policy for qualifying purchases. Your ownership is recorded on-chain for full transparency.',
  },
];
