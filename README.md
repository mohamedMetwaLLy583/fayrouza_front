# Fayrouzeh - Classified Ads Platform

A modern, bilingual (Arabic/English) classified ads platform built with Next.js 16, featuring user authentication, category browsing, and a responsive design optimized for both RTL and LTR languages.

## 🚀 Project Overview

Fayrouzeh is a comprehensive classified ads platform that allows users to browse categories, view advertisements, and manage their accounts. The platform supports both Arabic and English languages with proper RTL/LTR text direction handling.

## 🛠 Tech Stack & Dependencies

### Core Framework
- **Next.js 16.1.4** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Shadcn/ui** - Component library
- **Class Variance Authority** - Component variants

### State Management & Data Fetching
- **TanStack React Query 5.90.19** - Server state management
- **Axios 1.13.2** - HTTP client
- **React Hook Form 7.71.1** - Form handling

### Internationalization & Fonts
- **IBM Plex Sans Arabic** - Arabic font support
- **Custom i18n implementation** - Bilingual support (Arabic/English)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📁 Project Structure

```
fayrouzeh/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing/Login page
│   ├── body-wrapper.tsx         # Body wrapper for i18n
│   ├── globals.css              # Global styles
│   ├── home/                    # Home page
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   ├── forgot-password/         # Password recovery
│   ├── reset-password/          # Password reset
│   └── verify-otp/              # OTP verification
├── api/                         # API layer
│   ├── auth.api.ts             # Authentication endpoints
│   ├── home.api.ts             # Home page data endpoints
│   └── axios-instance.ts       # Configured Axios instance
├── components/                  # Reusable UI components
│   ├── ui/                     # Base UI components (Shadcn)
│   ├── login-form.tsx          # Login form component
│   ├── navbar.tsx              # Navigation bar
│   ├── footer.tsx              # Footer component
│   ├── auth-dropdown.tsx       # User authentication dropdown
│   ├── mega-menu.tsx           # Categories mega menu
│   └── Loader.tsx              # Loading component
├── contexts/                    # React contexts
│   └── categories-context.tsx  # Categories state management
├── hooks/                       # Custom React hooks
│   └── use-auth.ts             # Authentication hook
├── lib/                         # Utility libraries
│   ├── auth-utils.ts           # Authentication utilities
│   ├── utils.ts                # General utilities
│   └── i18n/                   # Internationalization
│       ├── context.tsx         # i18n context provider
│       ├── ar.ts               # Arabic translations
│       └── en.ts               # English translations
├── providers/                   # App providers
│   └── ReactQueryProvider.tsx  # React Query setup
└── public/                      # Static assets
    ├── locales/                # Translation files
    └── [images]                # App images and icons
```

## 🔐 Authentication Architecture

### Authentication Flow
1. **Login Process**: Email/password or social login (Google/Apple)
2. **Guest Access**: Anonymous browsing capability
3. **Token Management**: JWT tokens stored in localStorage
4. **Route Protection**: Automatic redirects based on auth status

### Authentication Components
- `useAuth` hook - Authentication state management
- `auth-utils.ts` - Utility functions for token handling
- `AuthDropdown` - User menu and logout functionality

### API Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/login` | POST | User authentication |
| `/guest-login` | POST | Anonymous access |
| `/register` | POST | User registration |
| `/forgot-password` | POST | Password recovery |
| `/reset-password` | POST | Password reset |
| `/verify-otp` | POST | OTP verification |
| `/countries` | GET | Country list |
| `/country_states` | GET | States by country |

## 🌐 Routing & Navigation

### App Router Structure
| Route | Component | Purpose | Auth Required |
|-------|-----------|---------|---------------|
| `/` | `app/page.tsx` | Landing/Login page | No |
| `/login` | `app/login/page.tsx` | Login page | No |
| `/register` | `app/register/page.tsx` | Registration | No |
| `/forgot-password` | `app/forgot-password/page.tsx` | Password recovery | No |
| `/reset-password` | `app/reset-password/page.tsx` | Password reset | No |
| `/verify-otp` | `app/verify-otp/page.tsx` | OTP verification | No |
| `/home` | `app/home/page.tsx` | Main dashboard | Yes |

### Navigation Components
- **Navbar**: Main navigation with search, notifications, and user menu
- **MegaMenu**: Category-based navigation
- **Footer**: Site links and company information

## 🎨 Component Hierarchy & UI Patterns

### Layout Components
```
RootLayout
├── ReactQueryProvider
├── I18nProvider
└── BodyWrapper (i18n direction handling)
```

### Page Components
```
HomePage
├── CategoriesProvider
├── Navbar
├── Main Content
│   ├── Categories Grid
│   └── Featured Ads (commented out)
└── Footer
```

### Form Components
- **LoginForm**: Email/password authentication with social login
- **Registration Form**: Multi-step user registration
- **Password Forms**: Recovery and reset functionality

### UI Components (Shadcn/ui)
- Button, Input, Select, Label
- Dropdown Menu, Popover, Navigation Menu
- Field components for form layouts

## 🌍 Internationalization (i18n)

### Language Support
- **Arabic (ar)**: Primary language with RTL support
- **English (en)**: Secondary language with LTR support

### i18n Implementation
```typescript
// Context-based translation system
const { t, language, toggleLanguage, dir } = useI18n();

// Usage
<h1>{t('welcomeTitle')}</h1>
<div dir={dir}>Content</div>
```

### Translation Keys
- Authentication: Login, register, password recovery
- Navigation: Menu items, buttons, labels
- Validation: Form error messages
- UI: Loading states, success/error messages

## 📡 API Integration & Data Flow

### API Configuration
```typescript
// Base URL: https://fayrouza.sdevelopment.tech/api
// Authentication: Bearer token in headers
// Request/Response: JSON format
```

### Data Flow Pattern
1. **React Query** manages server state and caching
2. **Axios interceptors** handle authentication tokens
3. **Error handling** with toast notifications
4. **Loading states** with proper UI feedback

### Key API Responses
```typescript
// Authentication Response
interface LoginResponse {
  status: number;
  data: {
    user: UserData;
    token: string;
  };
  message: string;
}

// Home Page Data
interface HomePageResponse {
  status: number;
  data: {
    categories: Category[];
    sliders: any[];
    home_ads: HomeAdCategory[];
  };
  message: string;
}
```

## 🔧 State Management

### Global State
- **React Query**: Server state, caching, and synchronization
- **React Context**: Categories, i18n, authentication
- **localStorage**: Token persistence, user preferences

### Context Providers
- `I18nProvider`: Language and direction management
- `CategoriesProvider`: Category data and loading states
- `ReactQueryProvider`: Query client configuration

### Custom Hooks
- `useAuth`: Authentication state and actions
- `useI18n`: Translation and language switching
- `useCategories`: Category data access

## ⚠️ Known Issues & Edge Cases

### Authentication Issues
- Token validation on page refresh
- Logout handling across tabs
- Guest session management

### UI/UX Considerations
- RTL/LTR layout switching
- Form validation in both languages
- Mobile responsiveness for Arabic text

### API Limitations
- Error message localization
- Rate limiting handling
- Network connectivity issues

## ✨ Recent Improvements (February 2027)

### 🏷️ Category Page Rebuild
- **Premium Slider**: Integrated a high-performance, dynamic image slider for category headers.
- **Advanced Filtering**: Implemented a responsive `FilterSidebar` with search, city selection, and price range filters, featuring a premium design with custom shadows and rounded corners.
- **High-Fidelity Ad Cards**: Redesigned both `AdCard` (Grid) and `AdCardHorizontal` (List) with premium badges, backdrop-blur effects, and improved information hierarchy to ensure design consistency across all view modes.
- **Sorting & View Controls**: Refined the main header section with improved typography for category titles and counts, alongside modern sorting dropdowns and high-contrast view mode toggles.

### 🔐 Authentication Polish
- **Functional Navigation**: Converted static login page links (Forgot Password, Create Account) to functional Next.js `Link` components.
- **Improved Feedback**: Added interactive toast notifications for social login placeholders and better error handling.

### 🛠️ Technical Stability
- **i18n Optimization**: Resolved missing translation keys and TypeScript compilation errors during build.
- **UI Consistency**: Standardized premium design tokens (rounded corners, color palettes) across new components.

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation Steps
```bash
# Clone the repository
git clone [repository-url]
cd fayrouzeh

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Environment Variables
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://fayrouza.sdevelopment.tech/api

# Optional: Analytics, monitoring, etc.
```

## 🏗️ Build & Deployment

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint
```

### Deployment Considerations
- Static asset optimization
- API endpoint configuration
- Environment-specific settings
- CDN setup for images

## 📱 Usage Examples

### User Registration Flow
```typescript
// 1. User fills registration form
// 2. Country/city selection with API calls
// 3. Form validation with react-hook-form
// 4. API submission with error handling
// 5. Success redirect to home page
```

### Category Browsing
```typescript
// 1. Home page loads categories via React Query
// 2. Categories displayed in responsive grid
// 3. Loading states and error handling
// 4. Future: Category filtering and search
```

### Language Switching
```typescript
// 1. User clicks language selector
// 2. i18n context updates language state
// 3. All text re-renders with new translations
// 4. Document direction updates (RTL/LTR)
// 5. Preference saved to localStorage
```

## 🤝 Development Guidelines

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Consistent component structure
- Proper error handling

### Component Patterns
- Functional components with hooks
- Props interface definitions
- Error boundaries where needed
- Accessibility considerations

### API Integration
- React Query for all server calls
- Proper loading and error states
- Type-safe API responses
- Centralized error handling

---

**Project Status**: Active Development
**Last Updated**: February 2027
**Version**: 0.2.0

For questions or contributions, please refer to the project documentation or contact the development team.