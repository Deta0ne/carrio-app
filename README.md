# Carrier App - Job Application Tracking System

A modern job application tracking system built with Next.js 15, Supabase, and shadcn/ui.

## Features

- 📝 Track job applications
- 🏢 Manage companies
- 📅 Set reminders
- 📊 View statistics
- 📁 Store documents
- 🔒 Secure authentication
- 🌙 Dark mode support
- 📱 Responsive design

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase
- **Authentication:** Supabase Auth
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **State Management:** React Context + Zustand
- **Forms:** react-hook-form + zod
- **File Storage:** Supabase Storage
- **Analytics:** Supabase Analytics

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/carrier-app.git
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local` with your Supabase credentials.

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/app
├── (auth)          # Authentication routes
├── (dashboard)     # Protected dashboard routes
└── api            # API routes
/components
├── ui             # shadcn components
├── forms          # Form components
├── dashboard      # Dashboard specific components
└── shared         # Shared components
/lib
├── utils          # Utility functions
├── hooks          # Custom hooks
└── constants      # Constants and enums
/utils
└── supabase       # Supabase client & types
/types             # TypeScript types
/public            # Static assets
```

## Authentication Flow

1. User signs up with email/password
2. Email verification required
3. Password reset flow available
4. Protected routes in dashboard
5. Session management

## Development Guidelines

- Use TypeScript strict mode
- Follow the component structure
- Implement proper error handling
- Write self-documenting code
- Follow accessibility guidelines
- Optimize for performance

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
