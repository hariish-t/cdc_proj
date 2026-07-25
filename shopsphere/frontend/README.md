# ShopSphere Analytics - Frontend

> Stunning React dashboard with real-time analytics, glassmorphism UI, and smooth animations

## 🌟 Features

### Design & UI
- ✨ **Glassmorphism Design** - Modern, translucent UI elements
- 🎨 **Dark/Light Mode** - Seamless theme switching
- 📱 **Fully Responsive** - Mobile-first design approach
- 🎭 **Framer Motion Animations** - Smooth, professional transitions
- 🎯 **Custom Tailwind Configuration** - Optimized utility classes

### Functionality
- 🔐 **JWT Authentication** - Secure login with refresh tokens
- 📊 **Interactive Charts** - Multiple chart types with Recharts
- ⚡ **Real-time Updates** - Socket.IO integration
- 💾 **Data Export** - Export to Excel/CSV
- 🔔 **Toast Notifications** - User-friendly feedback
- 📈 **Live Analytics** - Dashboard with animated counters

### Technical Excellence
- 🏗️ **Clean Architecture** - Organized component structure
- 🎣 **Custom Hooks** - Reusable logic patterns
- 🌐 **Context API** - Global state management
- 🔒 **Protected Routes** - Secure navigation
- 🎪 **Error Boundaries** - Graceful error handling
- 🎨 **Component Library** - Reusable UI components

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Backend server running on port 5000

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env` file from example:

```bash
cp .env.example .env
```

Edit `.env` with your backend URL:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend will start on http://localhost:5173

## 🚀 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Dashboard/       # Dashboard-specific components
│   │   ├── Layout/          # Navigation, Sidebar, Navbar
│   │   └── Shared/          # Shared utilities (Loader, etc.)
│   ├── context/             # React Context providers
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── ThemeContext.jsx # Theme management
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js       # Authentication hook
│   │   ├── useSocket.js     # Socket.IO hook
│   │   ├── useTheme.js      # Theme hook
│   │   └── useAnalytics.js  # Analytics data hook
│   ├── pages/               # Application pages
│   │   ├── Login.jsx        # Login page
│   │   └── Dashboard.jsx    # Main dashboard
│   ├── services/            # API and external services
│   │   ├── api.js           # Axios instance with interceptors
│   │   ├── socket.js        # Socket.IO service
│   │   └── auth.js          # Authentication helpers
│   ├── utils/               # Utility functions
│   │   └── formatters.js    # Data formatting utilities
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies and scripts
```

## 🎨 Component Highlights

### Dashboard Components

**StatsGrid** - Animated metric cards with real-time updates
- Glassmorphism design
- Animated counters
- Percentage indicators
- Hover effects

**RevenueCard** - Hero revenue display
- Large animated numbers
- Growth comparison
- Visual progress indicators
- Floating particle effects

**SalesChart** - Interactive charts
- Multiple chart types (Area, Line, Bar)
- Custom tooltips
- Responsive design
- Smooth animations

**TopCustomers** - Customer leaderboard
- Medal system for top 3
- Animated rankings
- Customer avatars
- Spending details

**RealtimeOrders** - Live order feed
- Socket.IO integration
- Real-time notifications
- Smooth entrance animations
- Sound effects

### Shared Components

**Loader** - Multiple loading variants
- Spinner, Pulse, Bouncing
- Full-screen option
- Skeleton loaders

**AnimatedCounter** - Smooth number animations
- Spring physics
- Currency formatting
- Custom prefixes/suffixes

**ErrorBoundary** - Graceful error handling
- Catches component errors
- User-friendly fallback UI
- Error details (dev mode)

## 🔐 Authentication Flow

1. User logs in with credentials
2. JWT tokens saved to localStorage
3. Tokens attached to all API requests
4. Auto-refresh on token expiry
5. Socket.IO connects with auth token

## ⚡ Real-time Features

### Socket.IO Events

**Client Subscribes:**
- `new-order` - New order notifications
- `order-update` - Order status changes
- `analytics-update` - Dashboard data updates
- `active-users` - Connected users count

**Client Emits:**
- `subscribe-analytics` - Join analytics room
- `unsubscribe-analytics` - Leave analytics room
- `ping` - Connection health check

## 🎨 Styling System

### Tailwind Utilities

Custom utilities defined in `tailwind.config.js`:
- `glass-card` - Glassmorphism effect
- `gradient-text` - Gradient text
- `btn-primary` - Primary button style
- `stat-card` - Animated stat card
- `badge-*` - Status badges

### Animation Classes

- `animate-fade-in` - Fade in effect
- `animate-slide-in` - Slide from left
- `animate-slide-up` - Slide from bottom
- `animate-shimmer` - Shimmer loading effect

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Socket.IO URL | `http://localhost:5000` |

## 🚀 Production Build

### Build for Production

```bash
npm run build
```

Builds create optimized bundle in `dist/` directory.

### Preview Build

```bash
npm run preview
```

### Deployment

Deploy `dist/` folder to:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist/` folder
- **AWS S3**: Upload to S3 bucket
- **Any static hosting**: Copy `dist/` contents

## 📊 Performance

- ✅ **Code Splitting** - Automatic route-based splitting
- ✅ **Lazy Loading** - Components loaded on demand
- ✅ **Image Optimization** - Vite image optimization
- ✅ **Tree Shaking** - Unused code eliminated
- ✅ **Minification** - Production builds minified

## 🎯 Key Technologies

- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Animation library
- **Recharts** - Chart library
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library
- **date-fns** - Date formatting

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Change port in vite.config.js
server: {
  port: 3000 // Your custom port
}
```

### API Connection Issues

Check `.env` configuration matches backend URL

### Socket.IO Not Connecting

Ensure backend is running and CORS is configured

### Build Errors

Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

MIT License - Created for MERN Stack Capstone Project

## 🎉 Project Highlights

### For Evaluators

This frontend demonstrates:

✅ **Production-Ready Code** - Clean, maintainable, well-documented  
✅ **Modern React Patterns** - Hooks, Context, Custom Hooks  
✅ **Professional UI/UX** - Glassmorphism, Dark Mode, Animations  
✅ **Real-time Features** - Socket.IO integration  
✅ **Security** - Protected routes, Token management  
✅ **Performance** - Optimized builds, Code splitting  
✅ **Responsive Design** - Mobile-first approach  
✅ **Error Handling** - Error boundaries, User feedback  

**This is a showcase of advanced MERN stack frontend development skills.**

---

Built with ❤️ for MERN Stack Capstone Project 2026
