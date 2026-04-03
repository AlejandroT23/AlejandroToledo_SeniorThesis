// src/hooks/useDriveToken.js
// Hook that provides a valid Google Drive access token.
// It reads the provider_token from the Supabase session,
// stores it in state, and exposes a getter that auto-refreshes
// when the token is stale.

import { useState, useEffect, useCallback } from 'react';
import {supabase} from '../../supabaseClient.js';

export default function useDriveToken() {
  const [driveToken, setDriveToken] = useState(null);

  // Grab the token from the current session on mount
  // and whenever the auth state changes (login, token refresh, etc.)
  useEffect(() => {
    // Check the current session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.provider_token) {
        setDriveToken(session.provider_token);
      }
    });

    // Listen for auth changes (login, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.provider_token) {
          setDriveToken(session.provider_token);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Get a valid token — if the current one is null or expired,
   * attempt a session refresh first.
   * Use this before every Drive API call.
   */
  const getToken = useCallback(async () => {
    if (driveToken) return driveToken;

    // Try refreshing the session to get a new provider_token
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Could not refresh Drive token:', error);
      return null;
    }

    const newToken = data?.session?.provider_token;
    if (newToken) {
      setDriveToken(newToken);
    }
    return newToken || null;
  }, [driveToken]);

  return { driveToken, getToken };
}