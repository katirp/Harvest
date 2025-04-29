'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../config/supabaseClient';

export default function OrdersList() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    const fetchOrders = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    restaurants:restaurant_id(name)
                `)
                .eq('farmer_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-600"></div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-brown-800 mb-6">Your Orders</h2>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{order.produce_name}</h3>
                                <p className="text-gray-600">From: {order.restaurants.name}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm ${order.status === 'fulfilled'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Total Quantity:</span>
                                <span>{order.quantity} {order.unit}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Pickup:</span>
                                <span>{new Date(order.pickup_date).toLocaleDateString()} at {order.pickup_location}</span>
                            </div>
                        </div>

                        <button
                            className="mt-4 w-full px-4 py-2 bg-brown-600 text-white rounded hover:bg-brown-700 transition-colors"
                            onClick={() => {/* TODO: Implement view details */ }}
                        >
                            View Details
                        </button>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No orders yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
} 