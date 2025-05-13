"use client";

import React, { useState } from 'react';

type LinkSuggestion = {
  id: string;
  sourceArticle: string;
  targetKeyword: string;
  suggestedAnchorText: string;
  insertLocation: string;
  destinationUrl: string;
  status: 'pending' | 'approved' | 'declined';
};

interface LinkSuggestionsProps {
  postId: string;
}

export default function LinkSuggestions({ postId }: LinkSuggestionsProps) {
  // In a real app, these would be fetched from an API based on the postId
  const [suggestions, setSuggestions] = useState<LinkSuggestion[]>([
    {
      id: '1',
      sourceArticle: 'Understanding Web Accessibility Standards',
      targetKeyword: 'WCAG',
      suggestedAnchorText: 'Web Content Accessibility Guidelines (WCAG)',
      insertLocation: 'Key Accessibility Guidelines section, paragraph 1',
      destinationUrl: '/blog/wcag-explained',
      status: 'pending',
    },
    {
      id: '2',
      sourceArticle: 'Understanding Web Accessibility Standards',
      targetKeyword: 'accessibility testing',
      suggestedAnchorText: 'test the accessibility of your website',
      insertLocation: 'Testing Accessibility section, paragraph 1',
      destinationUrl: '/blog/accessibility-testing-tools',
      status: 'pending',
    },
    {
      id: '3',
      sourceArticle: 'Understanding Web Accessibility Standards',
      targetKeyword: 'assistive technologies',
      suggestedAnchorText: 'assistive technologies',
      insertLocation: 'WCAG Principles section, list item 4',
      destinationUrl: '/blog/assistive-technologies-guide',
      status: 'pending',
    },
  ]);

  const handleStatusChange = (id: string, newStatus: 'approved' | 'declined') => {
    setSuggestions(prevSuggestions =>
      prevSuggestions.map(suggestion =>
        suggestion.id === id ? { ...suggestion, status: newStatus } : suggestion
      )
    );
    
    if (newStatus === 'approved') {
      // In a real app, you would call an API to implement the link in Webflow
      console.log(`Implementing link suggestion ${id} in Webflow...`);
    }
  };

  const handleEditAnchorText = (id: string, newText: string) => {
    setSuggestions(prevSuggestions =>
      prevSuggestions.map(suggestion =>
        suggestion.id === id ? { ...suggestion, suggestedAnchorText: newText } : suggestion
      )
    );
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Link Suggestions
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Review and approve suggested internal links for this article.
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Keyword
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Anchor Text
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destination
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suggestions.map((suggestion) => (
              <tr key={suggestion.id} className={suggestion.status !== 'pending' ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {suggestion.targetKeyword}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {suggestion.status === 'pending' ? (
                    <input
                      type="text"
                      value={suggestion.suggestedAnchorText}
                      onChange={(e) => handleEditAnchorText(suggestion.id, e.target.value)}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  ) : (
                    suggestion.suggestedAnchorText
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {suggestion.insertLocation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600 hover:text-primary-900">
                  <a href={suggestion.destinationUrl} target="_blank" rel="noopener noreferrer">
                    {suggestion.destinationUrl}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {suggestion.status === 'pending' ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(suggestion.id, 'approved')}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(suggestion.id, 'declined')}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      suggestion.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {suggestion.status === 'approved' ? 'Approved' : 'Declined'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {suggestions.length === 0 && (
        <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
          No link suggestions found for this article.
        </div>
      )}
    </div>
  );
} 