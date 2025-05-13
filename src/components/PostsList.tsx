import React, { useState } from 'react';
import Link from 'next/link';

type Post = {
  id: string;
  title: string;
  lastUpdated: string;
  slug: string;
  internalLinks: number;
  externalLinks: number;
};

export default function PostsList() {
  // In a real app, this would come from an API call
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: '10 Ways to Improve Your Website Speed',
      lastUpdated: '2023-10-15',
      slug: 'improve-website-speed',
      internalLinks: 3,
      externalLinks: 5,
    },
    {
      id: '2',
      title: 'The Ultimate Guide to SEO in 2023',
      lastUpdated: '2023-09-20',
      slug: 'ultimate-seo-guide-2023',
      internalLinks: 7,
      externalLinks: 4,
    },
    {
      id: '3',
      title: 'How to Create Effective Landing Pages',
      lastUpdated: '2023-08-05',
      slug: 'effective-landing-pages',
      internalLinks: 2,
      externalLinks: 3,
    },
    {
      id: '4',
      title: 'Understanding Web Accessibility Standards',
      lastUpdated: '2023-07-12',
      slug: 'web-accessibility-standards',
      internalLinks: 5,
      externalLinks: 8,
    },
    {
      id: '5',
      title: 'Content Marketing Strategies for 2023',
      lastUpdated: '2023-06-28',
      slug: 'content-marketing-strategies-2023',
      internalLinks: 4,
      externalLinks: 6,
    },
  ]);

  return (
    <ul className="divide-y divide-gray-200">
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/dashboard/posts/${post.id}`} className="block hover:bg-gray-50">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="truncate">
                  <div className="flex text-sm">
                    <p className="font-medium text-primary-600 truncate">{post.title}</p>
                  </div>
                  <div className="mt-2 flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Last updated: {post.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-6 flex flex-shrink-0 flex-col items-end">
                  <div className="flex space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {post.internalLinks} internal
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {post.externalLinks} external
                    </span>
                  </div>
                  <div className="mt-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Analyze
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
} 