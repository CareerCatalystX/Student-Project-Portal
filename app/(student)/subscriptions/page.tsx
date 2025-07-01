"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CreditCard, Package, AlertCircle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation';

interface Plan {
    id: string;
    name: string;
    price: number;
    billingCycle: 'MONTHLY' | 'YEARLY' | 'FREE';
    features: string[];
}

interface Subscription {
    id: string;
    status: 'ACTIVE' | 'CANCELED' | 'EXPIRED';
    startedAt: string;
    endsAt: string;
    plan: Plan;
}

interface ApiResponse {
    message: string;
    updatedSubscriptions: Subscription[];
}

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/subscriptions');
            const data: ApiResponse = await response.json();

            if (response.ok) {
                setSubscriptions(data.updatedSubscriptions);
            } else {
                setError(data.message || 'Failed to fetch subscriptions');
            }
        } catch (err) {
            setError('Failed to fetch subscriptions');
            console.error('Error fetching subscriptions:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysRemaining = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'EXPIRED':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'CANCELED':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'EXPIRED':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'CANCELED':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getBillingCycleText = (cycle: string) => {
        switch (cycle) {
            case 'MONTHLY':
                return 'Monthly';
            case 'YEARLY':
                return 'Yearly';
            case 'FREE':
                return 'Free';
            default:
                return cycle;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                        <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Error</h3>
                    <p className="text-gray-600 text-center mb-4">{error}</p>
                    <button
                        onClick={fetchSubscriptions}
                        className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-neutral-700 hover:text-neutral-800 hover:bg-neutral-200 px-2 py-1 rounded-md mb-4 -ml-2 lg:ml-0 transition duration-200"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-teal-700 mb-2">My Subscriptions</h1>
                    <p className="text-gray-600">Manage your active subscriptions and view your subscription history</p>
                </div>

                {/* Subscriptions List */}
                {subscriptions.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Subscriptions Found</h3>
                        <p className="text-gray-600 mb-6">You don't have any subscriptions yet. Browse our plans to get started.</p>
                        <button className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition duration-200">
                            Browse Plans
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {subscriptions.map((subscription) => {
                            const daysRemaining = getDaysRemaining(subscription.endsAt);
                            const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;

                            return (
                                <div key={subscription.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    {getStatusIcon(subscription.status)}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">{subscription.plan.name}</h3>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(subscription.status)}`}>
                                                            {subscription.status}
                                                        </span>
                                                        {isExpiringSoon && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                                                                Expiring Soon
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-gray-900">
                                                    ₹{subscription.plan.price}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {getBillingCycleText(subscription.plan.billingCycle)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subscription Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <div className="text-sm text-gray-500">Started</div>
                                                    <div className="font-medium">{formatDate(subscription.startedAt)}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <div className="text-sm text-gray-500">Ends</div>
                                                    <div className="font-medium">{formatDate(subscription.endsAt)}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <CreditCard className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <div className="text-sm text-gray-500">Days Remaining</div>
                                                    <div className={`font-medium ${daysRemaining < 0 ? 'text-red-600' : daysRemaining <= 7 ? 'text-orange-600' : 'text-green-600'}`}>
                                                        {daysRemaining < 0 ? 'Expired' : `${daysRemaining} days`}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Plan Features */}
                                        {subscription.plan.features.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 mb-2">Plan Features:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {subscription.plan.features.map((feature, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                                                        >
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}