// This script will be run as part of the build process to remove problematic files
const fs = require('fs');
const path = require('path');

// 1. Delete the problematic DashboardLayout.tsx file
const layoutFilePath = path.join(__dirname, 'src', 'components', 'DashboardLayout.tsx');

try {
  if (fs.existsSync(layoutFilePath)) {
    console.log(`Deleting problematic file: ${layoutFilePath}`);
    fs.unlinkSync(layoutFilePath);
    console.log('File deleted successfully');
  } else {
    console.log('Layout file does not exist, no need to delete');
  }
} catch (err) {
  console.error('Error deleting layout file:', err);
}

// 2. Replace the post detail page with a clean version
const postDetailPath = path.join(__dirname, 'src', 'app', 'dashboard', 'posts', '[id]', 'page.tsx');
const fixedContent = `"use client";

import React from 'react';
import LinkSuggestions from '@/components/LinkSuggestions';

interface PostDetailPageProps {
  params: {
    id: string;
  };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = params;
  
  // This would come from an API call in a real app
  const post = {
    id,
    title: 'Understanding Web Accessibility Standards',
    lastUpdated: '2023-07-12',
    slug: 'web-accessibility-standards',
    content: \`
      <h2>Introduction to Web Accessibility</h2>
      <p>Web accessibility ensures that websites, tools, and technologies are designed and developed so that people with disabilities can use them. More specifically, people can perceive, understand, navigate, and interact with the Web.</p>
      
      <h2>Key Accessibility Guidelines</h2>
      <p>The Web Content Accessibility Guidelines (WCAG) are developed through the W3C process in cooperation with individuals and organizations around the world, with a goal of providing a single shared standard for web content accessibility.</p>
      
      <h3>WCAG Principles</h3>
      <p>WCAG is organized around four principles often called by the acronym POUR:</p>
      <ul>
        <li><strong>Perceivable</strong>: Information and user interface components must be presentable to users in ways they can perceive.</li>
        <li><strong>Operable</strong>: User interface components and navigation must be operable.</li>
        <li><strong>Understandable</strong>: Information and the operation of user interface must be understandable.</li>
        <li><strong>Robust</strong>: Content must be robust enough that it can be interpreted by a wide variety of user agents, including assistive technologies.</li>
      </ul>
      
      <h2>Testing Accessibility</h2>
      <p>There are several tools available to test the accessibility of your website, including automated tools and manual testing procedures.</p>
    \`,
    internalLinks: 5,
    externalLinks: 8,
  };
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {post.title}
            </h1>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>Last updated: {post.lastUpdated}</span>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>Current links: {post.internalLinks} internal, {post.externalLinks} external</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              className="ml-3 btn"
            >
              Run New Analysis
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Post Content Preview */}
          <div className="md:w-1/2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Content Preview
                </h3>
              </div>
              <div className="px-4 py-5 sm:p-6 prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </div>
          </div>
          
          {/* Link Suggestions */}
          <div className="md:w-1/2">
            <LinkSuggestions postId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}`;

try {
  console.log(`Updating post detail page: ${postDetailPath}`);
  fs.writeFileSync(postDetailPath, fixedContent, 'utf8');
  console.log('Post detail page updated successfully');
} catch (err) {
  console.error('Error updating post detail page:', err);
} 