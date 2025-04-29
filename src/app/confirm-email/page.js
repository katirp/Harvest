'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ConfirmEmail() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Check Your Email
                    </h2>
                </div>

                <div className="mt-6 text-center">
                    <div className="mb-4">
                        <svg
                            className="h-12 w-12 text-indigo-500 mx-auto"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <p className="mb-4">
                        We&apos;ve sent a confirmation email to <strong>{email}</strong>
                    </p>
                    <p className="mb-6 text-sm text-gray-600">
                        Please check your inbox and click on the confirmation link to activate your account.
                    </p>

                    <div className="mt-8">
                        <Link
                            href="/signin"
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 