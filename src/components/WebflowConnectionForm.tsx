"use client";

import React, { useState } from 'react';

export default function WebflowConnectionForm() {
  const [isConnected, setIsConnected] = useState(false);
  const [sites, setSites] = useState<{ _id: string; name: string }[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [collections, setCollections] = useState<{ _id: string; name: string }[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [fieldMappings, setFieldMappings] = useState({
    title: '',
    slug: '',
    content: '',
    metaDescription: '',
  });

  const handleConnect = () => {
    // OAuth flow would redirect to Webflow, after which we'd get token in redirectUri
    console.log('Connecting to Webflow...');
    
    // Simulating data after successful connection
    setIsConnected(true);
    setSites([
      { _id: 'site1', name: 'My Company Blog' },
      { _id: 'site2', name: 'Personal Portfolio' },
    ]);
  };

  const handleSiteSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const siteId = e.target.value;
    setSelectedSite(siteId);
    
    // Simulate fetching collections for this site
    setCollections([
      { _id: 'coll1', name: 'Blog Posts' },
      { _id: 'coll2', name: 'Case Studies' },
    ]);
  };

  const handleFieldMapping = (field: keyof typeof fieldMappings, value: string) => {
    setFieldMappings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleStartAnalysis = () => {
    console.log('Starting analysis with:', {
      siteId: selectedSite,
      collectionId: selectedCollection,
      fieldMappings
    });
    // This would trigger the fetching of blog content and analysis process
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Webflow Connection</h3>
            <p className="mt-1 text-sm text-gray-500">
              Connect your Webflow account to start analyzing your blog content.
            </p>
          </div>

          {!isConnected ? (
            <button
              type="button"
              onClick={handleConnect}
              className="btn"
            >
              Connect to Webflow
            </button>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center text-sm text-green-600">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Connected to Webflow
              </div>

              <div>
                <label htmlFor="site" className="block text-sm font-medium text-gray-700">
                  Select Site
                </label>
                <select
                  id="site"
                  name="site"
                  value={selectedSite}
                  onChange={handleSiteSelect}
                  className="mt-1 input"
                >
                  <option value="">Select a site</option>
                  {sites.map(site => (
                    <option key={site._id} value={site._id}>{site.name}</option>
                  ))}
                </select>
              </div>

              {selectedSite && (
                <div>
                  <label htmlFor="collection" className="block text-sm font-medium text-gray-700">
                    Select Blog Collection
                  </label>
                  <select
                    id="collection"
                    name="collection"
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                    className="mt-1 input"
                  >
                    <option value="">Select a collection</option>
                    {collections.map(collection => (
                      <option key={collection._id} value={collection._id}>{collection.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedCollection && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Map CMS Fields</h4>
                  
                  <div>
                    <label htmlFor="title-field" className="block text-sm font-medium text-gray-700">
                      Title Field
                    </label>
                    <select
                      id="title-field"
                      value={fieldMappings.title}
                      onChange={(e) => handleFieldMapping('title', e.target.value)}
                      className="mt-1 input"
                    >
                      <option value="">Select title field</option>
                      <option value="name">Name</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="slug-field" className="block text-sm font-medium text-gray-700">
                      Slug Field
                    </label>
                    <select
                      id="slug-field"
                      value={fieldMappings.slug}
                      onChange={(e) => handleFieldMapping('slug', e.target.value)}
                      className="mt-1 input"
                    >
                      <option value="">Select slug field</option>
                      <option value="slug">Slug</option>
                      <option value="url">URL</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="content-field" className="block text-sm font-medium text-gray-700">
                      Content Field
                    </label>
                    <select
                      id="content-field"
                      value={fieldMappings.content}
                      onChange={(e) => handleFieldMapping('content', e.target.value)}
                      className="mt-1 input"
                    >
                      <option value="">Select content field</option>
                      <option value="body">Body</option>
                      <option value="content">Content</option>
                      <option value="post-content">Post Content</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="meta-field" className="block text-sm font-medium text-gray-700">
                      Meta Description Field (optional)
                    </label>
                    <select
                      id="meta-field"
                      value={fieldMappings.metaDescription}
                      onChange={(e) => handleFieldMapping('metaDescription', e.target.value)}
                      className="mt-1 input"
                    >
                      <option value="">Select meta description field</option>
                      <option value="meta-description">Meta Description</option>
                      <option value="seo-description">SEO Description</option>
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleStartAnalysis}
                      disabled={!fieldMappings.title || !fieldMappings.slug || !fieldMappings.content}
                      className="btn"
                    >
                      Start Analysis
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 