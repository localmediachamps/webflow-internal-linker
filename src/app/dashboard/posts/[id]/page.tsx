"use client";

import React from 'react';
import Link from 'next/link';
import LinkSuggestions from '@/components/LinkSuggestions';

export default function PostDetailPage({ params }) {
  const { id } = params;
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/posts" className="text-blue-500 hover:underline">
          &larr; Back to posts
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">Post Details: {id}</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <LinkSuggestions postId={id} />
      </div>
    </div>
  );
}