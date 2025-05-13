"use client";

import React from 'react';
import WebflowConnectionForm from '@/components/WebflowConnectionForm';
import PostsList from '@/components/PostsList';

export default function Dashboard() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <WebflowConnectionForm />
          
          {/* Conditionally render this once connected */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Blog Posts
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a post to analyze for internal linking opportunities.
              </p>
              <div className="mt-4">
                <button 
                  type="button" 
                  className="btn"
                >
                  Analyze All Posts
                </button>
              </div>
            </div>
            <PostsList />
          </div>
        </div>
      </div>
    </div>
  );
} 