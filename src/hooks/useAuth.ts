import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseReady } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  display_name?: string;
  avatar_url?: string;
  created_at?: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    if (!isSupabaseReady() || !supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: profile?.full_name || session.user.user_metadata?.full_name || '',
          display_name: profile?.display_name || '',
          avatar_url: profile?.avatar_url || '',
          created_at: session.user.created_at,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();

    if (!isSupabaseReady() || !supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: profile?.full_name || session.user.user_metadata?.full_name || '',
            display_name: profile?.display_name || '',
            avatar_url: profile?.avatar_url || '',
            created_at: session.user.created_at,
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [checkSession]);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    if (!isSupabaseReady() || !supabase) {
      return { success: false, error: 'Supabase not configured. Connect Supabase in the dashboard first.' };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || 'Sign up failed.' };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseReady() || !supabase) {
      return { success: false, error: 'Supabase not configured. Connect Supabase in the dashboard first.' };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || 'Invalid email or password.' };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseReady() || !supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!isSupabaseReady() || !supabase) {
      return { success: false, error: 'Supabase not configured. Please contact support.' };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send reset email.' };
    }
  }, []);

  return { user, loading, error, signUp, signIn, signOut, resetPassword, isAuthenticated: !!user };
}
