# 🎬 BuzzUGC - AI Video Creator

<div align="center">

**Transform any avatar into a speaking video with Google's VEO 3 Fast model**

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF.svg)](https://vitejs.dev/)
[![Fal.ai](https://img.shields.io/badge/Fal.ai-VEO%203%20Fast-00D4AA.svg)](https://fal.ai/)

</div>

## ✨ Features

- 🎭 **Avatar-Based UGC**: Transform any image into a speaking video
- ⚡ **VEO 3 Fast Integration**: Powered by Google's latest video generation model via Fal.ai
- 📱 **9:16 Aspect Ratio**: Perfect for TikTok, Instagram Reels, and YouTube Shorts
- 🎵 **Audio Generation**: Creates realistic lip-sync and natural speech
- 🔄 **Real-time Progress**: Live status updates during video generation
- 🎨 **Modern UI**: Beautiful, responsive interface with Tailwind CSS
- ⚡ **Fast Processing**: 8-second high-quality videos in minutes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/FrancescoDeFi/buzzugc.git
cd buzzugc

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎯 How It Works

1. **Select Avatar**: Choose or upload an avatar image
2. **Enter Script**: Type the text you want the avatar to say
3. **Generate Video**: AI creates a realistic speaking video
4. **Download & Share**: Get your UGC video ready for social media

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Model**: Google VEO 3 Fast via Fal.ai
- **Video Generation**: Image-to-video with lip-sync
- **Build Tool**: Vite for fast development

## 📁 Project Structure

```
buzzugc/
├── components/           # React components
│   ├── AvatarCard.tsx   # Avatar selection component
│   ├── GeneratedVideo.tsx # Video display component
│   ├── Header.tsx       # App header
│   └── LoadingIndicator.tsx # Loading states
├── pages/               # Page components
│   ├── CreationHub.tsx  # Main creation interface
│   └── LoginPage.tsx    # User authentication
├── services/            # API services
│   └── geminiService.ts # Fal.ai VEO 3 integration
├── types.ts            # TypeScript definitions
├── constants.ts        # App constants
└── index.tsx          # App entry point
```

## 🔧 Configuration

The app is pre-configured with Fal.ai credentials. For production deployment, set up environment variables:

```bash
# Optional: Override default settings
FAL_KEY=your_fal_api_key
```

## 📊 Video Specifications

- **Duration**: 8 seconds
- **Resolution**: 720p (HD)
- **Aspect Ratio**: 9:16 (vertical)
- **Audio**: Generated with lip-sync
- **Format**: MP4
- **Frame Rate**: 24 FPS

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build the project
npm run build

# Deploy dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Fal.ai](https://fal.ai/) for VEO 3 Fast model access
- [Google](https://deepmind.google/technologies/veo/) for the VEO 3 model
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) teams

---

<div align="center">
Made with ❤️ for creators who want to bring their avatars to life
</div>
