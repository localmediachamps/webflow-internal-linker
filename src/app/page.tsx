import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Webflow Internal</span>
          <span className="block text-primary-600">Linking Tool</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg">
          Boost your SEO by intelligently connecting your blog posts with targeted internal links.
          Our tool analyzes your Webflow blog content and recommends the best linking opportunities.
        </p>
        <div className="mt-8 flex justify-center">
          <Link 
            href="/dashboard" 
            className="btn"
          >
            Get Started →
          </Link>
          <Link 
            href="/about"
            className="ml-4 btn-outline"
          >
            Learn More
          </Link>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <FeatureCard 
          title="AI-Powered Analysis" 
          description="Uses natural language processing to identify key topics and keywords in your blog content."
          icon="🧠"
        />
        <FeatureCard 
          title="One-Click Implementation" 
          description="Add recommended internal links to your Webflow blog posts with a single click."
          icon="🔗"
        />
        <FeatureCard 
          title="SEO Performance Boost" 
          description="Improve site structure, increase page authority, and enhance user engagement."
          icon="📈"
        />
      </div>
    </main>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600 text-2xl">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );
} 