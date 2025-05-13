import axios from 'axios';

// Types for Webflow API responses
export interface WebflowSite {
  _id: string;
  name: string;
  shortName: string;
  timezone: string;
  createdOn: string;
  lastPublished: string;
}

export interface WebflowCollection {
  _id: string;
  name: string;
  slug: string;
  singularName: string;
}

export interface WebflowCollectionItem {
  _id: string;
  _draft: boolean;
  _archived: boolean;
  name: string;
  slug: string;
  [key: string]: any; // For dynamic fields
}

// API client
const createWebflowClient = (accessToken: string) => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_WEBFLOW_API_URL || 'https://api.webflow.com',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Version': '2.0.0',
      'Content-Type': 'application/json'
    }
  });

  return {
    // Get all sites for the authenticated user
    getSites: async (): Promise<WebflowSite[]> => {
      const response = await client.get('/sites');
      return response.data.sites;
    },

    // Get all collections for a site
    getCollections: async (siteId: string): Promise<WebflowCollection[]> => {
      const response = await client.get(`/sites/${siteId}/collections`);
      return response.data.collections;
    },

    // Get all items in a collection
    getCollectionItems: async (collectionId: string): Promise<WebflowCollectionItem[]> => {
      const response = await client.get(`/collections/${collectionId}/items`);
      return response.data.items;
    },

    // Get a specific collection item
    getCollectionItem: async (collectionId: string, itemId: string): Promise<WebflowCollectionItem> => {
      const response = await client.get(`/collections/${collectionId}/items/${itemId}`);
      return response.data.items[0];
    },

    // Update a collection item (for adding links)
    updateCollectionItem: async (collectionId: string, itemId: string, fields: Record<string, any>): Promise<WebflowCollectionItem> => {
      const response = await client.put(`/collections/${collectionId}/items/${itemId}`, {
        fields
      });
      return response.data;
    },

    // Publish changes to a collection item
    publishCollectionItem: async (collectionId: string, itemId: string, domains: string[] = []): Promise<void> => {
      await client.post(`/collections/${collectionId}/items/${itemId}/publish`, {
        domains
      });
    }
  };
};

export default createWebflowClient; 