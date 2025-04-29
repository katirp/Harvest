'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import supabase from '../config/supabaseClient';
import FarmerDashboard from '../components/farmer/FarmerDashboard';

export default function Dashboard() {
    const { user, loading, signOut } = useAuth();
    const [userRole, setUserRole] = useState(null);
    const [loadingRole, setLoadingRole] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Redirect if not authenticated
        if (!loading && !user) {
            router.push('/signin');
        }
    }, [user, loading, router]);

    useEffect(() => {
        async function fetchUserRole() {
            if (user) {
                try {
                    const { data, error } = await supabase
                        .from('user_roles')
                        .select('role')
                        .eq('user_id', user.id)
                        .single();

                    if (error) {
                        console.error('Error fetching user role:', error);
                    } else {
                        setUserRole(data?.role || null);
                    }
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    setLoadingRole(false);
                }
            }
        }

        fetchUserRole();
    }, [user]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/signin');
    };

    if (loading || loadingRole) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fffbeb] p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-brown-800">Harvest</h1>
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 bg-[#b4540a] text-white rounded hover:bg-brown-700"
                    >
                        Sign Out
                    </button>
                </div>

                {userRole === 'restaurant' && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Restaurant Dashboard</h2>
                        <p>Welcome to your restaurant dashboard. Here you can browse local produce and place orders from farmers.</p>
                        {/* Add restaurant-specific features here */}
                    </div>
                )}

                {userRole === 'farmer' && (
                    <FarmerDashboard />
                )}

                {!userRole && (
                    <div className="bg-yellow-100 p-4 rounded">
                        <p className="text-yellow-800">
                            You haven&apos;t selected a role yet. Please go to the role selection page.
                        </p>
                        <button
                            onClick={() => router.push('/select-role')}
                            className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                            Select Role
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
} 