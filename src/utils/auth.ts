// Utility functions for authentication and localStorage management
import { supabase } from '../lib/supabase';

export const clearAllAuthData = () => {
  try {
    let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    // Clear Supabase auth data
    localStorage.removeItem('sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token');
    
    // Clear any other auth-related localStorage items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('supabase') || key.includes('auth'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('All auth data cleared from localStorage');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

export const debugAuthState = () => {
  console.log('=== Auth Debug Info ===');
  console.log('LocalStorage keys:', Object.keys(localStorage));
  console.log('Supabase URL:', supabase.supabaseUrl);
  
  // Check for Supabase auth tokens
  const authKeys = Object.keys(localStorage).filter(key => 
    key.includes('supabase') || key.includes('auth')
  );
  console.log('Auth-related keys:', authKeys);
  
  authKeys.forEach(key => {
    console.log(`${key}:`, localStorage.getItem(key));
  });
  console.log('========================');
};
