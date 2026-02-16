# UPI Wallet & Money Leakage Radar - Frontend

A complete React (Vite) frontend for the UPI Wallet & Money Leakage Radar system with real-time analytics and intelligent leakage detection.

## Features

### Public Features
- Landing page with feature highlights
- User registration and authentication
- Responsive Bootstrap 5 UI

### User Features
- Dashboard with balance and quick actions
- Wallet operations (Add Money, Make Payments)
- Transaction history with filtering
- Leakage alerts with severity levels
- Analytics with Chart.js visualizations

### Admin Features
- System dashboard with key metrics
- User management (Block/Activate, Reset Wallet)
- System analytics and reporting
- Rule engine monitoring
- System health monitoring

## Tech Stack

- **React 18** with Vite
- **React Router DOM** for routing
- **Bootstrap 5** for UI components
- **Axios** for API calls with interceptors
- **Chart.js** with react-chartjs-2 for analytics
- **Context API** for state management
- **JWT** for authentication

## Project Structure

```
src/
├── api/                    # API layer
│   ├── axios.js           # Axios instance with interceptors
│   ├── endpoints.js       # Centralized API endpoints
│   ├── authApi.js         # Authentication API calls
│   ├── walletApi.js       # Wallet API calls
│   ├── adminApi.js        # Admin API calls
│   └── analyticsApi.js    # Analytics API calls
├── components/            # Reusable components
│   ├── ProtectedRoute.jsx # Route protection
│   ├── Navbar.jsx         # Navigation component
│   ├── Loader.jsx         # Loading spinner
│   └── ConfirmModal.jsx   # Confirmation modal
├── context/               # Context providers
│   └── AuthContext.jsx    # Authentication context
├── pages/                 # Page components
│   ├── Landing.jsx        # Public landing page
│   ├── auth/              # Authentication pages
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── user/              # User pages
│   │   ├── UserDashboard.jsx
│   │   ├── Wallet.jsx
│   │   ├── Transactions.jsx
│   │   ├── LeakageAlerts.jsx
│   │   └── LeakageAnalytics.jsx
│   └── admin/             # Admin pages
│       ├── AdminDashboard.jsx
│       ├── Users.jsx
│       ├── Analytics.jsx
│       ├── RuleMonitor.jsx
│       └── SystemHealth.jsx
├── utils/                 # Utility functions
│   └── jwt.js            # JWT helper functions
├── App.jsx               # Main app component
├── main.jsx              # Entry point
└── index.css             # Global styles
```

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm

### 1. Create Vite Project (if starting fresh)
```bash
npm create vite@latest upi-wallet-frontend -- --template react
cd upi-wallet-frontend
```

### 2. Install Dependencies
```bash
npm install axios react-router-dom bootstrap chart.js react-chartjs-2
```

### 3. Environment Configuration
Create `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production
```bash
npm run build
```

## API Integration

### Backend Requirements
- ASP.NET Core Web API with MySQL
- JWT Authentication with roles (USER, ADMIN)
- CORS enabled for frontend domain

### Expected API Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user info

#### Wallet Operations
- `GET /wallet/balance` - Get wallet balance
- `POST /wallet/add-money` - Add money to wallet
- `POST /wallet/pay` - Make payment
- `GET /wallet/transactions` - Get transaction history

#### Leakage Detection
- `GET /leakage/alerts` - Get leakage alerts
- `GET /leakage/analytics` - Get leakage analytics

#### Admin Operations
- `GET /admin/users` - Get all users
- `POST /admin/users/{id}/block` - Block user
- `POST /admin/users/{id}/activate` - Activate user
- `POST /admin/users/{id}/wallet/reset` - Reset user wallet
- `GET /admin/analytics` - Get system analytics
- `GET /admin/rules/status` - Get rules engine status
- `GET /admin/health` - Get system health

### Authentication Flow
1. User logs in with email/password
2. Backend returns JWT token
3. Token stored in localStorage
4. Axios interceptor adds token to all requests
5. 401/403 responses trigger automatic logout

## Key Features

### Role-Based Access Control
- Public routes: Landing, Login, Register
- USER routes: Dashboard, Wallet, Transactions, Alerts, Analytics
- ADMIN routes: Dashboard, Users, Analytics, Rule Monitor, System Health

### Error Handling
- Global axios interceptors for auth errors
- Loading states for all API calls
- User-friendly error messages
- Confirmation modals for destructive actions

### Responsive Design
- Bootstrap 5 responsive grid system
- Mobile-friendly navigation
- Optimized for desktop and mobile devices

### Real-time Features
- Auto-refresh for system health (30s intervals)
- Real-time balance updates
- Live rule engine monitoring

## Development Notes

### State Management
- Uses React Context API instead of Redux
- AuthContext manages authentication state
- Local component state for UI interactions

### API Architecture
- Centralized endpoint definitions
- Modular API functions by feature
- Consistent error handling
- Request/response interceptors

### Security
- JWT token validation
- Automatic token expiry handling
- Role-based route protection
- XSS protection through React

## Customization

### Styling
- Modify `src/index.css` for global styles
- Bootstrap variables can be customized
- Component-specific styles in respective files

### API Configuration
- Update `src/api/endpoints.js` for endpoint changes
- Modify `src/api/axios.js` for request/response handling
- Environment variables in `.env` file

### Features
- Add new pages in respective directories
- Update routing in `App.jsx`
- Extend API modules as needed

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License
MIT License