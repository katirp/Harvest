'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../config/supabaseClient';
import AddProduceModal from './AddProduceModal';
import EditProduceModal from './EditProduceModal';

export default function ProduceInventory() {
    const [produceItems, setProduceItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchProduceItems();
    }, [user]);

    const fetchProduceItems = async () => {
        try {
            const { data, error } = await supabase
                .from('produce_items')
                .select('*')
                .eq('farmer_id', user.id);

            if (error) throw error;
            setProduceItems(data || []);
        } catch (error) {
            console.error('Error fetching produce:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('produce_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProduceItems(produceItems.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting produce:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-brown-800">Your Produce</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-4 py-2 bg-[#b4540a] text-white rounded-lg hover:bg-[#a34909] transition-colors"
                >
                    <span className="mr-2">+</span>
                    Add Produce
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {produceItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                            <div className="text-gray-500">Available: {item.available_quantity} {item.unit}</div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <h4 className="font-medium text-gray-700">Price Tiers:</h4>
                            {item.price_tiers.map((tier, index) => (
                                <div key={index} className="flex justify-between text-gray-600">
                                    <span>{tier.min_quantity}+ {item.unit}:</span>
                                    <span>${tier.price}/{item.unit}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => setEditingItem(item)}
                                className="px-4 py-2 text-[#b4540a] border border-[#b4540a] rounded hover:bg-[#fff8f3] transition-colors flex-1"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors flex-1"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {produceItems.length === 0 && (
                    <div className="col-span-2 text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No produce items listed yet. Add your first item!</p>
                    </div>
                )}
            </div>

            {showAddModal && (
                <AddProduceModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={() => {
                        setShowAddModal(false);
                        fetchProduceItems();
                    }}
                />
            )}

            {editingItem && (
                <EditProduceModal
                    produceItem={editingItem}
                    onClose={() => setEditingItem(null)}
                    onEdit={() => {
                        setEditingItem(null);
                        fetchProduceItems();
                    }}
                />
            )}
        </div>
    );
} 