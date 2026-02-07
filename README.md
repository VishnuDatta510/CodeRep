# CodeRep - Spaced Repetition for LeetCode

<div align="center">
  <img src="public/icon128.png" alt="CodeRep Logo" width="100"/>
  <br/>
  <strong>Never forget a LeetCode problem again</strong>
  <br/>
  <br/>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

## About

CodeRep is a full-stack web application with a Chrome extension that uses **spaced repetition** to help developers retain their LeetCode problem-solving skills. By scheduling reviews at optimal intervals based on your performance, CodeRep ensures you remember what you practice.

### Why CodeRep?

Research shows we forget **70% of new information within 24 hours** without reinforcement. CodeRep combats the forgetting curve by:

- Automatically scheduling problem reviews at scientifically-optimized intervals
- Adjusting review frequency based on your performance (Failed/Hard/Good)
- Detecting when you submit solutions and prompting you to rate them
- Tracking your progress across hundreds of problems

## Features

- **Chrome Extension**: One-click problem addition directly from LeetCode pages
- **Smart Detection**: Automatically detects successful submissions and prompts for ratings
- **Intelligent Scheduling**: Spaced repetition algorithm adapts to your performance
- **Dashboard**: Track all problems, review dates, and progress in one place
- **Secure Auth**: Dual authentication system (Clerk + API tokens)
- **Notes System**: Add personal notes, hints, and patterns to each problem
- **Modern UI**: Clean, responsive interface built with Tailwind CSS and shadcn/ui

## Tech Stack

**Frontend**

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui (Radix UI)
- Lucide Icons

**Backend**

- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Clerk Authentication

**Chrome Extension**

- Manifest V3
- Content Scripts
- Service Worker
- Chrome Storage API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- Clerk account for authentication
- Chrome browser (for extension)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/VishnuDatta510/CodeRep.git
   cd coderep
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   ```

4. **Initialize the database**

   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Chrome Extension Setup

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `CodeRep-Extension` folder from this project
5. Go to Settings in the web app and generate an API token
6. Click the extension icon and paste your token to connect

## Usage

### Adding Problems

**Method 1: Chrome Extension**

1. Visit any LeetCode problem page
2. Click the "Add to CodeRep" button that appears
3. Problem is automatically added to your dashboard

**Method 2: Web Dashboard**

1. Open your dashboard
2. Click "+ Add New Problem"
3. Paste the LeetCode URL
4. Problem details are auto-fetched

### Reviewing Problems

1. Open the extension popup to see today's reviews
2. Click "Open" to navigate to the problem
3. Solve the problem on LeetCode
4. After submitting, the extension will prompt you to rate it
5. Choose "Failed", "Hard", or "Good"
6. Next review is automatically scheduled

### Managing Problems

- **Review Now**: Rate a problem manually from the dashboard
- **Notes**: Add personal notes, hints, or patterns
- **Stop Tracking**: Archive problems you no longer want to review
- **Delete**: Permanently remove problems
- **Reset Progress**: Start mastered problems from day 1

## Project Structure

```
coderep/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── landing/          # Landing page sections
│   ├── problems/         # Problem management
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities
├── prisma/               # Database schema
├── CodeRep-Extension/    # Chrome extension
└── public/               # Static assets
```

## Spaced Repetition Algorithm

CodeRep uses an adaptive interval system:

- **Failed**: Interval resets to 1 day
- **Hard**: Interval × 1.2 (20% increase)
- **Good**: Interval × 2.5 (2.5x increase)
- **Easy**: Interval × 4.0 (4x increase)

Maximum interval is capped at 60 days. When a problem reaches 60 days, it's considered "mastered"!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Links

- **Live Demo**: [coderep.vercel.app](https://coderep.vercel.app)

## Author

**Vishnu Datta**

- GitHub: [@VishnuDatta510](https://github.com/VishnuDatta510)
- Email: vishnudatta2004@gmail.com

## Acknowledgments

- Inspired by [Anki](https://apps.ankiweb.net/) spaced repetition system
- Built with [Next.js](https://nextjs.org/) and [shadcn/ui](https://ui.shadcn.com/)
- Authentication powered by [Clerk](https://clerk.com/)

---

<div align="center">
  Made for developers by Developer.
</div>
