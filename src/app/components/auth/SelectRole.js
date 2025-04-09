'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import supabase from '../../config/supabaseClient';

export default function SelectRole() {
    const [role, setRole] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const { user, loading, updateUserRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Check if user is authenticated
        async function checkAuth() {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                // No active session, redirect to sign in
                router.push('/signin');
            } else {
                setIsChecking(false);
            }
        }

        checkAuth();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!role) {
            setError('Please select a role');
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await updateUserRole(role);
            if (error) {
                console.error('Role update error:', error);
                setError(error.message);
                setIsLoading(false);
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setError('An unexpected error occurred');
            setIsLoading(false);
        }
    };

    if (loading || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Select Your Role
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Choose how you&apos;ll use Harvest
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                id="restaurant"
                                name="role"
                                type="radio"
                                value="restaurant"
                                checked={role === 'restaurant'}
                                onChange={(e) => setRole(e.target.value)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                disabled={isLoading}
                            />
                            <label htmlFor="restaurant" className="ml-3 block text-sm font-medium text-gray-700">
                                Restaurant
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="farmer"
                                name="role"
                                type="radio"
                                value="farmer"
                                checked={role === 'farmer'}
                                onChange={(e) => setRole(e.target.value)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                disabled={isLoading}
                            />
                            <label htmlFor="farmer" className="ml-3 block text-sm font-medium text-gray-700">
                                Farmer
                            </label>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                'Continue'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 