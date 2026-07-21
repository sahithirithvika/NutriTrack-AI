# NutriTrack AI

A modern Next.js application for child nutrition tracking and health monitoring with AI-powered insights, voice copilot, and real-time analytics.

## Features

- 🎨 **Modern UI/UX** - Responsive design with Tailwind CSS and Framer Motion animations
- 🔐 **Authentication System** - Secure user authentication and authorization
- 🎤 **Voice Copilot** - AI-powered voice assistant for hands-free interaction
- 📊 **Parent Dashboard** - Real-time health metrics and child development tracking
- 📈 **Analytics** - Comprehensive health analytics and insights
- 🌍 **Multi-language Support** - Internationalization ready
- 🎯 **Modern Stack** - Built with React 19, Next.js 16, TypeScript, and Tailwind CSS

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **React**: 19.2.4
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) + [clsx](https://github.com/lukeed/clsx)
- **Animations**: [Framer Motion](https://www.framer.com/motion)
- **Icons**: [Lucide React](https://lucide.dev)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Components**: Custom components with Tailwind CSS
- **Notifications**: [Sonner](https://sonner.emilkowal.ski)
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ or npm/yarn/pnpm/bun package manager
- Git

## Installation

Clone the repository:
```bash
git clone https://github.com/sahithirithvika/NutriTrack-AI.git
cd NutriTrack-AI
```

Install dependencies:
```bash
npm install
```

## Quick Start

### Development Server

Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Build for Production

Build the application:
```bash
npm run build
```

### Production Server

Start the production server:
```bash
npm start
```

### Linting

Check code quality:
```bash
npm run lint
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable React components
│   ├── lib/             # Utility functions and services
│   └── styles/          # Global stylesheets
├── public/              # Static assets
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── next.config.ts       # Next.js configuration
```

## Development

### Hot Reload

The app supports hot module reloading. Simply save your changes in `src/` and the page will auto-update in your browser.

### Key Entry Points

- **Pages**: `src/app/` - Define routes and pages
- **Components**: `src/components/` - Reusable UI components
- **Styles**: `src/app/globals.css` - Global styles with Tailwind CSS

## Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com), created by the Next.js team:

1. Push your code to GitHub
2. Import the repository to Vercel
3. Vercel will auto-detect Next.js and configure build settings
4. Deploy with one click

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more options.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Tutorial](https://nextjs.org/learn)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or feedback, please open an issue on GitHub.
