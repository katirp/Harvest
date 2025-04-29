'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (sign in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password) => {
        try {
            // Sign up the user
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    const updateUserRole = async (role) => {
        try {
            // Get the current session to ensure we have the latest user data
            const { data: sessionData } = await supabase.auth.getSession();
            const currentUser = sessionData.session?.user;

            if (!currentUser) {
                throw new Error('No authenticated user found. Please sign in again.');
            }

            const { data, error } = await supabase
                .from('user_roles')
                .upsert({ user_id: currentUser.id, role })
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    // Function to check if a user's email has been confirmed
    const checkEmailConfirmed = async (email) => {
        try {
            // This is a workaround since Supabase doesn't provide a direct way to check email confirmation
            // We attempt to sign in with an incorrect password and check the error message
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password: 'checking-confirmation-status',
            });

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    // Email is confirmed, but password is wrong
                    return { isConfirmed: true, error: null };
                } else if (error.message.includes('Email not confirmed')) {
                    // Email is not confirmed
                    return { isConfirmed: false, error: null };
                } else {
                    // Some other error
                    return { isConfirmed: false, error };
                }
            }

            // Should never reach here with incorrect password
            return { isConfirmed: true, error: null };
        } catch (error) {
            return { isConfirmed: false, error };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            signUp,
            signIn,
            signOut,
            updateUserRole,
            checkEmailConfirmed
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}; 