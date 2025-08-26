# My Will SaaS Platform

A comprehensive Software as a Service platform for will creation and management, designed specifically for UK financial advisers, mortgage brokers, and estate planning professionals.

## 🚀 Features

### Core Functionality
- **Multi-tenant Architecture**: Each broker operates in an isolated environment with complete data separation
- **Client Management**: Comprehensive CRM for managing client relationships and contact information
- **Will Creation Wizard**: Step-by-step guided will creation with validation and auto-save
- **Attestation Support**: In-person or supervised video attestation with compliance tracking
- **Document Storage**: Secure encrypted storage with time-limited access links
- **Audit Logging**: Comprehensive audit trails for all sensitive actions
- **Role-Based Access Control**: broker, broker_admin, and platform_admin roles

### Technical Features
- **Next.js 14 App Router**: Modern React framework with TypeScript
- **Prisma ORM**: Type-safe database operations with SQLite (dev) / PostgreSQL (prod)
- **NextAuth.js**: Secure authentication with credentials provider
- **shadcn/ui**: Beautiful, accessible UI components with Tailwind CSS
- **Zod Validation**: Runtime type safety and input validation
- **Glassmorphism Design**: Modern UI with frosted translucent panels

## 📋 Requirements

- Node.js 18+ 
- npm or yarn
- SQLite (development) / PostgreSQL (production)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/co9159x/Willwiz.git
   cd Willwiz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Storage (for production)
   STORAGE_BUCKET="your-s3-bucket"
   STORAGE_REGION="your-s3-region"
   STORAGE_ACCESS_KEY="your-access-key"
   STORAGE_SECRET_KEY="your-secret-key"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

## 🗄️ Database

### Development
The application uses SQLite for development, stored in `prisma/dev.db`.

### Production
For production, configure PostgreSQL in your environment variables.

### Database Management
```bash
# View database in Prisma Studio
npm run db:studio

# Reset database
rm prisma/dev.db
npm run db:push
npm run db:seed
```

## 👥 User Roles

### Platform Admin
- Manage broker tenants
- View system-wide audit logs
- Monitor platform usage
- Access: `/admin`

### Broker Admin
- Manage staff within their tenant
- View tenant-specific analytics
- Configure pricing and settings

### Broker
- Create and manage clients
- Generate wills through the wizard
- Manage attestations
- Store and retrieve documents

## 🔐 Authentication

The platform uses NextAuth.js with credentials provider:

### Default Users (from seed data)
- **Platform Admin**: `admin@platform.co.uk` / `admin123`
- **Broker (Alder)**: `broker@alder.co.uk` / `test1234`
- **Broker (Birch)**: `broker@birch.co.uk` / `test1234`

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (protected)/       # Protected routes
│   │   ├── admin/         # Platform admin pages
│   │   ├── clients/       # Client management
│   │   ├── dashboard/     # Broker dashboard
│   │   ├── pricing/       # Pricing management
│   │   ├── storage/       # Document storage
│   │   ├── tasks/         # Task management
│   │   └── wills/         # Will creation wizard
│   ├── api/               # API routes
│   ├── login/             # Authentication
│   ├── policies/          # Legal pages
│   └── page.tsx           # Landing page
├── components/            # Reusable UI components
├── lib/                   # Utility functions
├── prisma/               # Database schema and migrations
├── tests/                # Test files
│   ├── e2e/              # End-to-end tests
│   └── unit/             # Unit tests
└── styles/               # Global styles
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/reset` - Password reset

### Clients
- `GET /api/clients` - List clients
- `POST /api/clients` - Create client
- `GET /api/clients/[id]` - Get client details
- `PATCH /api/clients/[id]` - Update client
- `GET /api/clients/[id]/notes` - Get client notes
- `POST /api/clients/[id]/notes` - Create note
- `GET /api/clients/[id]/tasks` - Get client tasks
- `POST /api/clients/[id]/tasks` - Create task

### Wills
- `POST /api/wills` - Create will
- `GET /api/wills/[id]` - Get will details
- `PATCH /api/wills/[id]` - Update will
- `POST /api/wills/[id]/preview` - Generate preview
- `POST /api/wills/[id]/send_for_approval` - Send for approval
- `POST /api/wills/[id]/attestation/complete` - Complete attestation

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/[id]` - Get task details
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Storage
- `GET /api/storage` - List documents

### Pricing
- `GET /api/pricing` - Get pricing
- `PATCH /api/pricing` - Update pricing

### Admin
- `GET /api/admin/brokers` - List brokers
- `POST /api/admin/brokers` - Create broker
- `GET /api/admin/audit` - Get audit logs

## 🎨 UI Components

The application uses shadcn/ui components with custom styling:

### Custom Classes
- `.button-base` - Consistent button sizing
- `.card-glass` - Glassmorphism card styling

### Design System
- **Colors**: Tailwind CSS with custom palette
- **Typography**: Inter font family
- **Spacing**: Consistent 4px grid system
- **Icons**: Lucide React icons

## 🔒 Security Features

- **Tenant Isolation**: All data queries scoped by tenantId
- **Role-Based Access**: Granular permissions per user role
- **Input Validation**: Zod schemas for all API inputs
- **Audit Logging**: Comprehensive event tracking
- **Password Hashing**: bcryptjs for secure password storage
- **Session Management**: Secure cookie-based sessions

## 📊 Analytics & Monitoring

### Heatmap Instrumentation
The platform includes stub heatmap tracking for:
- Wizard step completion rates
- User interaction patterns
- Drop-off point analysis
- Time-on-step metrics

### Audit Events
All sensitive actions are logged:
- Client creation/updates
- Will status changes
- Document access
- User authentication
- Pricing changes

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Docker
```bash
# Build image
docker build -t my-will-saas .

# Run container
docker run -p 3000:3000 my-will-saas
```

### Environment Variables for Production
```env
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
STORAGE_BUCKET="your-s3-bucket"
STORAGE_REGION="your-s3-region"
STORAGE_ACCESS_KEY="your-access-key"
STORAGE_SECRET_KEY="your-secret-key"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@mywill.co.uk
- Documentation: [docs.mywill.co.uk](https://docs.mywill.co.uk)
- Issues: [GitHub Issues](https://github.com/co9159x/Willwiz/issues)

## 🗺️ Roadmap

### Phase 2 Features (Future)
- AI assistant and explainer
- Advanced analytics and heatmaps
- Trust generators and LPA
- Digital will storage with blockchain
- CRM integrations
- Client portal
- Payment processing
- AI intake mode

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Zod](https://zod.dev/) - TypeScript-first schema validation

---

**My Will SaaS** - Professional will creation platform for UK brokers and financial advisers.
