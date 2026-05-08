import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { chatConversations } from '@/mocks/messages';
import { useAnnouncements } from '@/context/AnnouncementsContext';

export default function CommunityChatPage() {
  const [conversations, setConversations] = useState(chatConversations);
  const [activeId, setActiveId] = useState(1);
  const [input, setInput] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: '', description: '', isPublic: true });
  const [createdGroups, setCreatedGroups] = useState<{ id: number; name: string; avatar: string; description: string; members: number; online: number; lastMessage: string; lastTime: string; type: string; unread: number; messages: any[] }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'groups' | 'dms'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { broadcasts, markBroadcastRead } = useAnnouncements();

  // Auto-open DM if query param present
  useEffect(() => {
    const dmTarget = searchParams.get('dm');
    if (!dmTarget) return;
    const existing = allConversations.find((c) => c.name.toLowerCase() === dmTarget.toLowerCase() && c.type === 'dm');
    if (existing) {
      setActiveId(existing.id);
      setMobileSidebarOpen(false);
    } else {
      // Create new DM
      const newDm = {
        id: 200 + createdGroups.length,
        name: dmTarget,
        avatar: dmTarget.charAt(0).toUpperCase(),
        type: 'dm',
        lastMessage: 'Start chatting...',
        lastTime: 'Just now',
        unread: 0,
        online: true,
        messages: [
          { id: Date.now(), sender: 'System', me: false, text: `You started a conversation with ${dmTarget}.`, time: 'Just now' },
        ],
      };
      setCreatedGroups((prev) => [newDm, ...prev]);
      setActiveId(newDm.id);
    }
  }, [searchParams]);

  const allConversations = [...conversations, ...createdGroups];

  const filteredConversations = allConversations.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === 'all'
        ? true
        : filterType === 'groups'
        ? c.type === 'group'
        : c.type === 'dm';
    return matchesSearch && matchesType;
  });

  const activeConversation = allConversations.find((c) => c.id === activeId) || allConversations[0];

  // Inject unread broadcast system messages into active group chat
  const [seenBroadcastIds, setSeenBroadcastIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!activeConversation || activeConversation.type !== 'group') return;
    const newBroadcasts = broadcasts.filter((b) => !seenBroadcastIds.has(b.id));
    if (newBroadcasts.length === 0) return;

    const systemMessages = newBroadcasts.map((b) => ({
      id: `sys-${b.id}`,
      sender: 'System',
      me: false,
      text: b.text,
      time: new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeId || c.type !== 'group') return c;
        const existingIds = new Set(c.messages.map((m: any) => m.id));
        const toAdd = systemMessages.filter((sm) => !existingIds.has(sm.id));
        if (toAdd.length === 0) return c;
        return {
          ...c,
          messages: [...c.messages, ...toAdd],
          lastMessage: toAdd[toAdd.length - 1].text,
          lastTime: 'Just now',
        };
      })
    );

    setCreatedGroups((prev) =>
      prev.map((c) => {
        if (c.id !== activeId || c.type !== 'group') return c;
        const existingIds = new Set(c.messages.map((m: any) => m.id));
        const toAdd = systemMessages.filter((sm) => !existingIds.has(sm.id));
        if (toAdd.length === 0) return c;
        return {
          ...c,
          messages: [...c.messages, ...toAdd],
          lastMessage: toAdd[toAdd.length - 1].text,
          lastTime: 'Just now',
        };
      })
    );

    setSeenBroadcastIds((prev) => {
      const next = new Set(prev);
      newBroadcasts.forEach((b) => next.add(b.id));
      return next;
    });
  }, [broadcasts, activeId, activeConversation?.type]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: 'You',
      me: true,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;
        return {
          ...c,
          messages: [...c.messages, newMsg],
          lastMessage: input.trim(),
          lastTime: 'Just now',
          unread: 0,
        };
      })
    );
    setCreatedGroups((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c;
        return {
          ...c,
          messages: [...c.messages, newMsg],
          lastMessage: input.trim(),
          lastTime: 'Just now',
          unread: 0,
        };
      })
    );
    setInput('');
  };

  const totalUnread = allConversations.reduce((sum, c) => sum + (c.unread || 0), 0);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupForm.name.trim()) return;
    const newGroup = {
      id: 100 + createdGroups.length,
      name: groupForm.name.trim(),
      avatar: groupForm.name.trim().charAt(0).toUpperCase(),
      description: groupForm.description.trim(),
      members: 1,
      online: 1,
      lastMessage: 'Group created. Start chatting!',
      lastTime: 'Just now',
      type: 'group',
      unread: 0,
      messages: [
        { id: Date.now(), sender: 'System', me: false, text: `Welcome to ${groupForm.name.trim()}!`, time: 'Just now' },
      ],
    };
    setCreatedGroups((prev) => [newGroup, ...prev]);
    setGroupForm({ name: '', description: '', isPublic: true });
    setShowCreateGroup(false);
    setActiveId(newGroup.id);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-dark-700/50 shrink-0">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 shrink-0">
            <img
              src="https://static.readdy.ai/image/e514fc972d3ac011ec046bb027a8bd60/05b8712378af54b96f49b8eeeac4fc04.png"
              alt="Ai EARNERS Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">
              Ai <span className="text-gold-400">EARNERS</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors items-center gap-1 whitespace-nowrap">
              <i className="ri-dashboard-line w-4 h-4 flex items-center justify-center" /> Dashboard
            </Link>
            <Link to="/activity" className="hidden sm:flex text-sm text-white/60 hover:text-white transition-colors items-center gap-1 whitespace-nowrap">
              <i className="ri-pulse-line w-4 h-4 flex items-center justify-center" /> Activity
            </Link>
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold">
              MT
            </div>
          </div>
        </div>
      </div>

      {/* Chat Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            mobileSidebarOpen ? 'absolute inset-0 z-30 bg-dark-900/98' : 'hidden md:flex'
          } md:relative flex-col w-full md:w-80 border-r border-dark-700/40 shrink-0`}
        >
          <div className="p-4 border-b border-dark-700/40 flex items-center justify-between">
            <h2 className="text-white font-semibold text-sm">Messages</h2>
            <div className="flex items-center gap-2">
              {totalUnread > 0 && (
                <span className="text-[10px] bg-gold-500 text-dark-900 font-bold px-2 py-0.5 rounded-full">
                  {totalUnread}
                </span>
              )}
              <button
                onClick={() => setShowCreateGroup(true)}
                className="w-7 h-7 rounded-md bg-gold-500/10 hover:bg-gold-500/20 border border-gold-400/20 flex items-center justify-center transition-colors"
                title="Create Group"
              >
                <i className="ri-add-line text-gold-400 text-xs w-4 h-4 flex items-center justify-center" />
              </button>
              <button
                className="md:hidden w-8 h-8 flex items-center justify-center text-white/60"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="p-3 border-b border-dark-700/40 flex flex-col gap-2">
            <div className="relative">
              <i className="ri-search-line absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 text-xs w-4 h-4 flex items-center justify-center" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-dark-800 border border-dark-700/50 rounded-md pl-8 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  <i className="ri-close-line w-4 h-4 flex items-center justify-center" />
                </button>
              )}
            </div>
            <div className="flex bg-dark-800/60 border border-dark-700/40 rounded-lg p-0.5">
              {(
                [
                  { key: 'all', label: 'All' },
                  { key: 'groups', label: 'Groups' },
                  { key: 'dms', label: 'DMs' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterType(tab.key)}
                  className={`flex-1 px-2 py-1 text-[10px] rounded-md transition-all whitespace-nowrap ${
                    filterType === tab.key ? 'bg-gold-500 text-dark-900 font-semibold' : 'text-white/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveId(c.id);
                  setConversations((prev) =>
                    prev.map((conv) => (conv.id === c.id ? { ...conv, unread: 0 } : conv))
                  );
                  setCreatedGroups((prev) =>
                    prev.map((conv) => (conv.id === c.id ? { ...conv, unread: 0 } : conv))
                  );
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-start gap-3 px-4 py-3 border-b border-dark-700/30 transition-colors text-left ${
                  activeId === c.id ? 'bg-dark-800/60 border-l-2 border-l-gold-500' : 'hover:bg-dark-800/30 border-l-2 border-l-transparent'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 text-xs font-bold">
                    {c.avatar}
                  </div>
                  {c.type === 'dm' && c.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-dark-900 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm text-white font-medium truncate">{c.name}</span>
                    <span className="text-[10px] text-white/30 shrink-0 ml-2">{c.lastTime}</span>
                  </div>
                  <div className="text-xs text-white/40 truncate">{c.lastMessage}</div>
                  {c.type === 'group' && (
                    <div className="text-[10px] text-white/25 mt-0.5">{c.members?.toLocaleString()} members &middot; {c.online?.toLocaleString()} online</div>
                  )}
                </div>
                {c.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-gold-500 text-dark-900 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
            {filteredConversations.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-white/40">
                <i className="ri-search-line w-5 h-5 flex items-center justify-center mx-auto mb-2 text-white/20" />
                No conversations match your search.
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-dark-700/40 shrink-0">
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center text-white/60"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <i className="ri-menu-line w-5 h-5 flex items-center justify-center" />
            </button>
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 text-xs font-bold">
                {activeConversation.avatar}
              </div>
              {activeConversation.type === 'dm' && activeConversation.online && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-dark-900 rounded-full" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm text-white font-medium">{activeConversation.name}</div>
              {activeConversation.type === 'group' ? (
                <div className="text-[10px] text-white/40">
                  {activeConversation.members?.toLocaleString()} members &middot; {activeConversation.online?.toLocaleString()} online
                </div>
              ) : (
                <div className="text-[10px] text-emerald-400">{activeConversation.online ? 'Online' : 'Last seen 1 hr ago'}</div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-3">
              {activeConversation.messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.me ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                      msg.me
                        ? 'bg-gold-500 text-dark-900'
                        : msg.sender === 'System'
                        ? 'bg-dark-800/80 border border-dark-700/40 text-gold-400'
                        : 'bg-dark-800 border border-dark-700/40 text-white'
                    }`}
                  >
                    {!msg.me && (
                      <div className="text-[10px] text-gold-400 font-medium mb-0.5">
                        {msg.sender === 'System' ? (
                          <span className="flex items-center gap-1">
                            <i className="ri-shield-check-line w-3 h-3 flex items-center justify-center" />
                            {msg.sender}
                          </span>
                        ) : (
                          msg.sender
                        )}
                      </div>
                    )}
                    <div className="text-sm leading-relaxed">{msg.text}</div>
                    <div className={`text-[10px] mt-1 ${msg.me ? 'text-dark-900/50' : 'text-white/30'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="px-4 py-3 border-t border-dark-700/40 shrink-0 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              maxLength={500}
              className="flex-1 bg-dark-800 border border-dark-700/50 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-gold-500 hover:bg-gold-600 disabled:opacity-40 flex items-center justify-center transition-colors shrink-0"
            >
              <i className="ri-send-plane-fill text-dark-900 text-sm w-5 h-5 flex items-center justify-center" />
            </button>
          </form>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateGroup(false)} />
          <div className="relative bg-surface-card border border-dark-700/50 rounded-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Create Group</h3>
              <button
                onClick={() => setShowCreateGroup(false)}
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <i className="ri-close-line w-5 h-5 flex items-center justify-center" />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Group Name *</label>
                <input
                  type="text"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. DeFi Alpha Traders"
                  maxLength={40}
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Description</label>
                <textarea
                  value={groupForm.description}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="What is this group about?"
                  maxLength={120}
                  rows={3}
                  className="w-full bg-dark-800 border border-dark-700/50 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-gold-400/50 transition-colors resize-none"
                />
                <p className="text-[10px] text-white/25 mt-1 text-right">{groupForm.description.length}/120</p>
              </div>
              <div className="flex items-center justify-between bg-dark-800/40 rounded-md px-3 py-2.5 border border-dark-700/30">
                <span className="text-sm text-white/70">Public Group</span>
                <button
                  type="button"
                  onClick={() => setGroupForm((prev) => ({ ...prev, isPublic: !prev.isPublic }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${groupForm.isPublic ? 'bg-gold-500' : 'bg-dark-700'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${groupForm.isPublic ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </div>
              <button
                type="submit"
                disabled={!groupForm.name.trim()}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-dark-900 font-semibold py-2.5 rounded-md transition-colors text-sm"
              >
                Create Group
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
