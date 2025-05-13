# Webflow Internal Linker

A web application that analyzes Webflow CMS blog collections and recommends internal links between articles based on inferred target keywords.

## Features

- 🔑 **OAuth Integration**: Connect securely with your Webflow account
- 🧠 **AI-Powered Analysis**: Uses natural language processing to identify potential linking opportunities
- 🎯 **Smart Suggestions**: Recommends contextually relevant internal links with appropriate anchor text
- 👁️ **Visual Editing**: Review and approve link suggestions through an intuitive interface
- 🔄 **One-Click Implementation**: Add links directly to your Webflow blog with a single click
- 📊 **Performance Tracking**: Monitor your internal linking strategy

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js with Next.js API routes
- **Authentication**: NextAuth.js with Webflow OAuth
- **Database**: Supabase
- **NLP**: OpenAI API and natural for keyword extraction
- **APIs**: Webflow CMS API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Webflow account with CMS collections
- Supabase account
- OpenAI API key

### Environment Variables

Copy the `.env.example` file to `.env.local` and fill in the required values:

```
# Webflow API
NEXT_PUBLIC_WEBFLOW_API_URL=https://api.webflow.com
WEBFLOW_CLIENT_ID=your-webflow-client-id
WEBFLOW_CLIENT_SECRET=your-webflow-client-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Auth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/webflow-internal-linker.git
cd webflow-internal-linker
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

The application requires the following tables in Supabase:

- `users` - Stores user information and Webflow tokens
- `sites` - Webflow sites connected by users
- `collections` - Blog collections to analyze
- `blog_posts` - Cache of blog posts from Webflow
- `link_suggestions` - Generated link suggestions
- `link_history` - Record of implemented links

A SQL schema is available in the `supabase` directory.

## Usage

1. Connect your Webflow account
2. Select the site and blog collection to analyze
3. Map your CMS fields (title, slug, content, etc.)
4. Run the analysis to generate link suggestions
5. Review and approve/decline suggestions
6. Approved links are automatically added to your Webflow blog

## Development Roadmap

- [ ] Bulk link implementation
- [ ] Custom keyword targeting
- [ ] Advanced analytics dashboard
- [ ] A/B testing for link text
- [ ] Automatic scheduled analysis

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, feature requests, or questions, please open an issue on GitHub. 