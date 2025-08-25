# InstaSave - Instagram Photo & Video Downloader

A modern, responsive web application for downloading Instagram photos, videos, reels, and stories. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **High Quality Downloads**: Download content in original quality (Full HD, 1080p, 2K, 4K)
- **All Content Types**: Support for photos, videos, reels, stories, and profile pictures
- **Mobile Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Fast & Secure**: No data storage, completely anonymous usage
- **Modern UI**: Clean, intuitive interface inspired by popular downloaders
- **Free to Use**: No registration required, completely free

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Emoji-based icons for universal compatibility
- **Deployment**: Vercel (recommended)

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/instasave.git
cd instasave
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── Header.tsx      # Navigation header
│   ├── URLInput.tsx    # Instagram URL input
│   ├── MediaResult.tsx # Download results
│   └── Footer.tsx      # Site footer
├── lib/               # Utility libraries
│   ├── utils.ts       # Helper functions
│   └── instagram.ts   # Instagram API integration
└── types/             # TypeScript type definitions
    └── index.ts       # Shared types
```

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env.local` and configure:

```env
# Optional: Instagram API credentials for production
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=https://yourdomain.com/auth/callback

# App configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### Instagram API Setup (Optional)

For production use with real Instagram content:

1. Create a Facebook Developer account
2. Create a new app and add Instagram Basic Display
3. Get your App ID and App Secret
4. Configure redirect URI in your app settings
5. Add credentials to environment variables

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/instasave)

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `.next` folder to Netlify

### Deploy to Railway

1. Connect your GitHub repository
2. Select the Next.js template
3. Deploy automatically

## 📝 API Documentation

### POST /api/resolve

Resolves Instagram URLs to downloadable media.

**Request:**
```json
{
  "url": "https://www.instagram.com/p/XXXXXXXXX/"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "XXXXXXXXX",
    "type": "image",
    "url": "https://www.instagram.com/p/XXXXXXXXX/",
    "thumbnail": "https://...",
    "caption": "Post caption",
    "username": "username",
    "downloadUrls": [
      {
        "id": "high",
        "type": "image",
        "quality": "high",
        "url": "https://...",
        "width": 1080,
        "height": 1080,
        "fileSize": 524288,
        "format": "jpg",
        "label": "High Quality Image (1080x1080)"
      }
    ]
  },
  "message": "Content resolved successfully"
}
```

## ⚖️ Legal & Compliance

### Important Notice

- This tool is intended for downloading **your own content** or content you have permission to save
- We do not store user data or download history
- Users are responsible for respecting copyright and privacy rights
- We are not affiliated with Instagram or Meta

### Terms of Use

- Use only for content you own or have rights to download
- Respect Instagram's Terms of Service
- Do not use for bulk downloading or commercial purposes
- Do not violate copyright or privacy rights

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Write clear, descriptive commit messages
4. Test your changes thoroughly
5. Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://instasave.vercel.app)
- [Documentation](https://github.com/yourusername/instasave/wiki)
- [Issues](https://github.com/yourusername/instasave/issues)
- [Pull Requests](https://github.com/yourusername/instasave/pulls)

## ⭐ Support

If you find this project helpful, please give it a star on GitHub!

---

**Disclaimer**: This project is for educational purposes. Always respect content creators' rights and Instagram's Terms of Service.
