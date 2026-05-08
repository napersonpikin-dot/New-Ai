import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export type NotificationType = 'withdrawal' | 'robot' | 'announcement' | 'system' | 'support' | 'loan';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp'>) => void;
  refreshNotifications: () => void;
}

const defaultNotifications: Notification[] = [
  {
    id: '1',
    type: 'withdrawal',
    title: 'Withdrawal Completed',
    message: 'Your withdrawal of ₦142 to USDT wallet has been processed successfully.',
    read: false,
    timestamp: '2026-05-02T09:30:00Z',
    actionUrl: '/dashboard',
  },
  {
    id: '2',
    type: 'robot',
    title: 'Robot Upgrade Available',
    message: 'YieldMaster X v2.1 is now live with 8% improved yield optimization.',
    read: false,
    timestamp: '2026-05-01T14:15:00Z',
    actionUrl: '/dashboard',
  },
  {
    id: '3',
    type: 'announcement',
    title: 'New Robot: SignalBot Prime',
    message: 'We just launched SignalBot Prime — starting at ₦199 with ₦10/day returns.',
    read: true,
    timestamp: '2026-04-28T10:00:00Z',
    actionUrl: '/#robots',
  },
  {
    id: '4',
    type: 'system',
    title: 'Security Audit Complete',
    message: 'Our quarterly security audit completed with zero issues found.',
    read: true,
    timestamp: '2026-04-25T08:00:00Z',
  },
  {
    id: '5',
    type: 'support',
    title: 'Support Ticket Resolved',
    message: 'Your ticket #AE-44321 about wallet connection has been resolved.',
    read: false,
    timestamp: '2026-05-02T07:20:00Z',
    actionUrl: '/contact',
  },
  {
    id: '6',
    type: 'withdrawal',
    title: 'Withdrawal Requested',
    message: 'Your withdrawal request of ₦310 via Bank Transfer is being processed.',
    read: true,
    timestamp: '2026-04-21T16:45:00Z',
    actionUrl: '/dashboard',
  },
];

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);

  // Load notifications from Supabase on mount
  const refreshNotifications = useCallback(async () => {
    if (!supabase) return;
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData?.session?.user?.id;
    if (!uid) return;
    const { data, error } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error && data) {
      const mapped: Notification[] = (data as any[]).map((n) => ({
        id: String(n.id),
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        timestamp: n.created_at,
        actionUrl: n.action_url,
      }));
      setNotifications((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = mapped.filter((m) => !existingIds.has(m.id));
        return [...newItems, ...prev];
      });
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(() => refreshNotifications(), 30000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(async (n: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...n,
      id: Math.random().toString(36).slice(2, 9),
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);

    // Also persist to Supabase for cross-device sync
    if (supabase) {
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData?.session?.user?.id;
      if (uid) {
        await supabase.from('user_notifications').insert({
          user_id: uid,
          type: n.type,
          title: n.title,
          message: n.message,
          read: false,
          action_url: n.actionUrl || null,
        });
      }
    }
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification, addNotification, refreshNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be inside NotificationsProvider');
  return ctx;
}