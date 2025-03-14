# Carbonly.ai - Carbon Emission Tracker

Carbonly.ai is a modern, AI-powered platform for tracking and managing organizational carbon emissions. Built with Next.js 15, React, and Supabase, it provides a comprehensive solution for businesses to monitor, analyze, and reduce their carbon footprint.

## Features

- 🌱 **AI-Powered Document Scanning**: Automatically extract carbon emission data from various file types
- 📊 **Emission Analytics**: Track emissions across Scope 1, 2, and 3 categories
- 🧠 **Predictive AI**: Forecast future emissions and identify reduction opportunities
- 📚 **Material Library**: Configurable emission factors for accurate calculations
- 👥 **Team Collaboration**: Multi-user support with role-based access control
- 🔌 **REST API**: Integration capabilities with existing systems

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Authentication)
- **AI/ML**: OpenAI integration for document processing
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation

## Project Structure

```
├── app/                 # Next.js 15 app directory
│   ├── (auth)/         # Authentication routes (login, register)
│   ├── dashboard/      # Dashboard and feature routes
│   ├── admin/         # Super admin panel routes
│   └── api/           # API routes
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── dashboard/     # Dashboard-specific components
│   ├── admin/         # Super admin components
│   └── shared/        # Shared components
├── lib/               # Utility functions and configurations
├── context/          # React context providers
├── types/            # TypeScript type definitions
└── public/           # Static assets
```

## Data Flow

1. **Authentication Flow**:
   - Users sign up/login through Supabase Auth
   - Session management via AuthProvider context
   - Protected routes handled by middleware

2. **Emission Data Flow**:
   - Data input through file uploads or manual entry
   - AI processing for document extraction
   - Storage in Supabase database
   - Real-time updates via Supabase subscriptions

3. **Organization Structure**:
   - Organizations can have multiple projects
   - Projects can be individual or joint ventures
   - Team members have role-based permissions

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Database Schema

The application uses the following main tables in Supabase:

- `organizations`: Company/organization details
- `users`: User accounts and profiles
- `projects`: Carbon tracking projects
- `emission_data`: Actual emission records
- `emission_factors`: Reference data for calculations
- `integrations`: Third-party service connections

### Admin Panel Schema
- `admin_users`: Super admin user accounts
- `subscription_plans`: Available subscription tiers
- `feature_flags`: Feature toggle configurations
- `system_settings`: Global system configurations
- `audit_logs`: System-wide audit trail

## Access Levels

1. **Super Admin (SaaS Administrator)**
   - Full system access
   - Manage subscription plans
   - Monitor all organizations
   - Configure global settings
   - Access audit logs
   - Manage feature flags

2. **Organization Admin**
   - Manage organization settings
   - Invite team members
   - Access all organization data
   - Configure organization-specific settings

3. **Team Member**
   - Access assigned projects
   - Input and view emission data
   - Generate reports
   - Collaborate with team

## Admin Panel Features

### Organization Management
- View and manage all organizations
- Monitor subscription status
- Access organization analytics
- Handle organization support requests

### Subscription Management
- Create and modify subscription plans
- Process subscription changes
- Monitor subscription metrics
- Handle billing issues

### System Configuration
- Configure global settings
- Manage feature flags
- Set up integration defaults
- Configure email templates

### Analytics & Reporting
- System-wide analytics
- Usage statistics
- Revenue reports
- Performance metrics

### Audit & Compliance
- Access detailed audit logs
- Monitor system security
- Track user activities
- Manage compliance settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary software. All rights reserved. 