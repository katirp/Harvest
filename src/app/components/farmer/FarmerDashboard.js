'use client';

import { useState } from 'react';
import ProduceInventory from './ProduceInventory';
import OrdersList from './OrdersList';

export default function FarmerDashboard() {
    const [activeTab, setActiveTab] = useState('inventory');

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`${activeTab === 'inventory'
                            ? 'border-brown-600 text-brown-600'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                    >
                        Inventory
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`${activeTab === 'orders'
                            ? 'border-brown-600 text-brown-600'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                    >
                        Orders
                    </button>
                </nav>
            </div>

            {/* Tab content */}
            {activeTab === 'inventory' ? (
                <ProduceInventory />
            ) : (
                <OrdersList />
            )}
        </div>
    );
} 