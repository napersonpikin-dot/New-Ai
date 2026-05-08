import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface BroadcastMessage {
  id: string;
  text: string;
  timestamp: string;
  sender: string;
}

interface AnnouncementsContextType {
  broadcasts: BroadcastMessage[];
  broadcast: (text: string, sender?: string) => void;
  unreadBroadcastIds: string[];
  markBroadcastRead: (id: string) => void;
}

const AnnouncementsContext = createContext<AnnouncementsContextType | null>(null);

export function AnnouncementsProvider({ children }: { children: ReactNode }) {
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const broadcast = useCallback((text: string, sender = 'Admin') => {
    const msg: BroadcastMessage = {
      id: Math.random().toString(36).slice(2, 11),
      text,
      timestamp: new Date().toISOString(),
      sender,
    };
    setBroadcasts((prev) => [msg, ...prev]);
  }, []);

  const markBroadcastRead = useCallback((id: string) => {
    setReadIds((prev) => new Set(prev).add(id));
  }, []);

  const unreadBroadcastIds = broadcasts.filter((b) => !readIds.has(b.id)).map((b) => b.id);

  return (
    <AnnouncementsContext.Provider value={{ broadcasts, broadcast, unreadBroadcastIds, markBroadcastRead }}>
      {children}
    </AnnouncementsContext.Provider>
  );
}

export function useAnnouncements() {
  const ctx = useContext(AnnouncementsContext);
  if (!ctx) throw new Error('useAnnouncements must be inside AnnouncementsProvider');
  return ctx;
}
