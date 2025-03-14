# Carbonly AI

A modern web application for tracking and managing carbon emissions.

## Features

- Real-time carbon emissions tracking
- Scope 1, 2, and 3 emissions monitoring
- Interactive charts and visualizations
- Date range selection
- User authentication
- Organization management
- Project management

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- React Hook Form
- Zod
- Radix UI
- Lucide Icons

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/carbonly-ai.git
   cd carbonly-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Update the Supabase URL and anon key with your values

4. Set up the database:
   - Create a new project in Supabase
   - Run the SQL migrations in `supabase/migrations`

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
carbonly-ai/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── admin/             # Admin routes
│   ├── dashboard/         # Dashboard routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...               # Feature components
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

