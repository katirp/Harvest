'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../config/supabaseClient';

export default function AddProduceModal({ onClose, onAdd }) {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        unit: 'lbs',
        available_quantity: '',
        price_tiers: [
            { min_quantity: 1, price: '' }
        ]
    });

    const handleAddTier = () => {
        setFormData(prev => ({
            ...prev,
            price_tiers: [...prev.price_tiers, { min_quantity: '', price: '' }]
        }));
    };

    const handleRemoveTier = (index) => {
        setFormData(prev => ({
            ...prev,
            price_tiers: prev.price_tiers.filter((_, i) => i !== index)
        }));
    };

    const handleTierChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            price_tiers: prev.price_tiers.map((tier, i) => {
                if (i === index) {
                    return { ...tier, [field]: value };
                }
                return tier;
            })
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate price tiers
            const sortedTiers = [...formData.price_tiers]
                .sort((a, b) => a.min_quantity - b.min_quantity);

            const { data, error } = await supabase
                .from('produce_items')
                .insert([
                    {
                        farmer_id: user.id,
                        name: formData.name,
                        unit: formData.unit,
                        available_quantity: Number(formData.available_quantity),
                        price_tiers: sortedTiers
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            onAdd(data);
        } catch (error) {
            console.error('Error adding produce:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#fffbeb] bg-opacity-90 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add New Produce</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Produce Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brown-500"
                            placeholder="e.g. Organic Tomatoes"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Unit
                            </label>
                            <select
                                value={formData.unit}
                                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brown-500"
                            >
                                <option value="lbs">Pounds (lbs)</option>
                                <option value="heads">Heads</option>
                                <option value="crates">Crates</option>
                                <option value="boxes">Boxes</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Available Quantity
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.available_quantity}
                                onChange={(e) => setFormData(prev => ({ ...prev, available_quantity: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brown-500"
                                placeholder="e.g. 100"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Price Tiers
                            </label>
                            <button
                                type="button"
                                onClick={handleAddTier}
                                className="text-sm text-brown-600 hover:text-brown-700"
                            >
                                + Add Tier
                            </button>
                        </div>

                        <div className="space-y-3">
                            {formData.price_tiers.map((tier, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={tier.min_quantity}
                                            onChange={(e) => handleTierChange(index, 'min_quantity', Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brown-500"
                                            placeholder="Min quantity"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="relative">
                                            <span className="absolute left-3 top-2">$</span>
                                            <input
                                                type="number"
                                                required
                                                min="0.01"
                                                step="0.01"
                                                value={tier.price}
                                                onChange={(e) => handleTierChange(index, 'price', Number(e.target.value))}
                                                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brown-500"
                                                placeholder="Price per unit"
                                            />
                                        </div>
                                    </div>
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTier(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-[#b4540a] text-white rounded-md hover:bg-brown-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Adding...' : 'Add Produce'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 