/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_WEBFLOW_API_URL: process.env.NEXT_PUBLIC_WEBFLOW_API_URL,
    WEBFLOW_CLIENT_ID: process.env.WEBFLOW_CLIENT_ID,
    WEBFLOW_CLIENT_SECRET: process.env.WEBFLOW_CLIENT_SECRET,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  images: {
    domains: ['assets.webflow.com'],
  },
};

module.exports = nextConfig; 