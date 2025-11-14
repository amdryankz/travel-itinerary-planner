# 🌍 Travel Itinerary Planner

> A modern web application for planning, organizing, and managing your travel itineraries with AI-powered features.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-000000?logo=express)](https://expressjs.com/)

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🤖 AI-Powered Features

- **AI Itinerary Generator**: Automatically generate complete day-by-day itineraries using Google Gemini AI
- **Smart Route Optimization**: Optimize your travel routes for efficiency
- **AI Budget Analysis**: Get intelligent budget insights and spending recommendations
- **Activity Suggestions**: Receive personalized activity recommendations based on destination
- **AI Chat Assistant**: Interactive travel assistant to answer questions and provide tips

### 🗓️ Trip Management

- **Manual & AI Trip Creation**: Choose between manual planning or AI-generated itineraries
- **Day-by-Day Planning**: Organize activities by days with detailed schedules
- **Activity Management**: Add, edit, and delete activities with:
  - Time slots (start/end time)
  - Categories (sightseeing, food, transport, hotel, etc.)
  - Location mapping
  - Cost estimates
  - Notes and descriptions

### 💰 Budget Tracking

- **Expense Management**: Track actual expenses throughout your trip
- **Budget vs. Actual**: Compare planned budget with actual spending
- **Category Breakdown**: Visualize expenses by category
- **Real-time Statistics**: Monitor spending with live budget statistics

### 🗺️ Location & Mapping

- **Interactive Maps**: View all activities on an interactive Leaflet map
- **Google Maps Integration**:
  - Location search and geocoding
  - Distance and duration calculations
  - Route planning
- **Location Picker**: Easy location selection for activities

### 👤 User Authentication

- **JWT Authentication**: Secure token-based authentication
- **Google OAuth**: Sign in with Google account
- **Protected Routes**: Secure pages requiring authentication

### 📊 Visualization & Analytics

- **Trip Statistics**: Overview of activities, expenses, and trip details
- **Budget Tracker**: Visual budget tracking with progress indicators
- **Expense Charts**: Visualize spending patterns

## 🛠️ Tech Stack

### Frontend

- **React 19.2.0** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **React Leaflet** - Map components
- **Lucide React** - Icon library
- **date-fns** - Date utility library

### Backend

- **Node.js** - Runtime environment
- **Express 5.1.0** - Web framework
- **PostgreSQL** - Primary database
- **Sequelize** - ORM for database operations
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Google Generative AI (Gemini)** - AI-powered features
- **Google Maps Services** - Location and mapping services
- **CORS** - Cross-origin resource sharing
- **Jest** - Testing framework

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

You'll also need API keys for:

- **Google Gemini AI** (for AI features)
- **Google Maps API** (for mapping and location services)
- **Google OAuth** (for social login)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/amdryankz/travel-itinerary-planner.git
cd travel-planner
```

### 2. Install dependencies

#### Backend (Server)

```bash
cd server
npm install
```

#### Frontend (Client)

```bash
cd ../client
npm install
```

### 3. Set up PostgreSQL Database

```bash
# Create database
createdb travel_planner

# Or using psql
psql -U postgres
CREATE DATABASE travel_planner;
\q
```

### 4. Run database migrations

```bash
cd server
npx sequelize-cli db:migrate
```

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=travel_planner
DB_HOST=localhost
DB_DIALECT=postgres

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here
MODEL_NAME=gemini-1.5-flash

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### Frontend (.env)

Create a `.env` file in the `client` directory:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:3000/api

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### How to Get API Keys

#### Google Gemini AI

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key

#### Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
   - Distance Matrix API
   - Places API
4. Create credentials (API Key)

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Create OAuth 2.0 Client ID
4. Add authorized origins and redirect URIs

## 🎮 Running the Application

### Development Mode

#### 1. Start the Backend Server

```bash
cd server
npm run dev
```

Server will run on `http://localhost:3000`

#### 2. Start the Frontend

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173`

### Production Build

#### Backend

```bash
cd server
node bin/www
```

#### Frontend

```bash
cd client
npm run build
npm run preview
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

| Method | Endpoint         | Description               |
| ------ | ---------------- | ------------------------- |
| POST   | `/auth/register` | Register new user         |
| POST   | `/auth/login`    | Login with email/password |
| POST   | `/auth/google`   | Login with Google OAuth   |
| GET    | `/auth/me`       | Get current user profile  |

### Trips Endpoints

| Method | Endpoint     | Description        |
| ------ | ------------ | ------------------ |
| GET    | `/trips`     | Get all user trips |
| GET    | `/trips/:id` | Get trip by ID     |
| POST   | `/trips`     | Create new trip    |
| PUT    | `/trips/:id` | Update trip        |
| DELETE | `/trips/:id` | Delete trip        |

### Activities Endpoints

| Method | Endpoint                   | Description               |
| ------ | -------------------------- | ------------------------- |
| GET    | `/activities/trip/:tripId` | Get activities for a trip |
| GET    | `/activities/:id`          | Get activity by ID        |
| POST   | `/activities/trip/:tripId` | Create new activity       |
| PUT    | `/activities/:id`          | Update activity           |
| DELETE | `/activities/:id`          | Delete activity           |

### Expenses Endpoints

| Method | Endpoint                       | Description             |
| ------ | ------------------------------ | ----------------------- |
| GET    | `/expenses/trip/:tripId`       | Get expenses for a trip |
| GET    | `/expenses/trip/:tripId/stats` | Get expense statistics  |
| POST   | `/expenses/trip/:tripId`       | Create new expense      |
| PUT    | `/expenses/:id`                | Update expense          |
| DELETE | `/expenses/:id`                | Delete expense          |

### AI Endpoints

| Method | Endpoint                           | Description               |
| ------ | ---------------------------------- | ------------------------- |
| POST   | `/ai/generate-itinerary`           | Generate AI itinerary     |
| POST   | `/ai/optimize-route/:tripId`       | Optimize route with AI    |
| POST   | `/ai/suggestions`                  | Get AI travel suggestions |
| GET    | `/ai/activity-suggestions/:tripId` | Get activity suggestions  |
| GET    | `/ai/analyze-budget/:tripId`       | Get AI budget analysis    |
| POST   | `/ai/geocode`                      | Geocode address           |
| POST   | `/ai/distance`                     | Calculate distance        |
| POST   | `/ai/places`                       | Search places             |

## 📁 Project Structure

```
travel-planner/
├── client/                   # Frontend React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── api/            # API client functions
│   │   ├── app/            # Redux store configuration
│   │   ├── components/     # Reusable React components
│   │   │   ├── ai/        # AI-related components
│   │   │   ├── budget/    # Budget tracking components
│   │   │   ├── common/    # Common UI components
│   │   │   ├── map/       # Map components
│   │   │   └── trip/      # Trip-related components
│   │   ├── constants/     # App constants
│   │   ├── features/      # Redux features/slices
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                  # Backend Node.js application
│   ├── __test__/           # Test files
│   ├── bin/
│   │   └── www            # Server startup file
│   ├── config/
│   │   └── config.js      # Database configuration
│   ├── controllers/       # Request handlers
│   ├── middlewares/       # Express middlewares
│   ├── migrations/        # Database migrations
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── services/          # Business logic & external services
│   │   ├── gemini.js     # Google Gemini AI service
│   │   └── maps.js       # Google Maps service
│   ├── utils/             # Utility functions
│   ├── app.js             # Express app setup
│   └── package.json
│
└── README.md               # This file
```

## 🧪 Testing

### Backend Tests

Run all tests:

```bash
cd server
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

View test coverage:

```bash
npm test -- --coverage
```

The project includes comprehensive tests for:

- Authentication flows
- API endpoints
- Database models
- Controllers
- Middlewares
- Error handling

Coverage threshold: 90% (branches, functions, lines, statements)

## 🎨 Key Features Explained

### AI Itinerary Generation

The app uses Google Gemini AI to generate complete itineraries based on:

- Destination
- Date range
- Budget constraints
- User preferences

### Smart Budget Management

Track your expenses with:

- Real-time budget tracking
- Category-based expense breakdown
- AI-powered budget analysis
- Visual budget indicators

### Interactive Mapping

- View all activities on an interactive map
- Calculate distances between locations
- Get route optimization suggestions
- Search and select locations easily

### Responsive Design

Built with Tailwind CSS for a mobile-first, responsive experience that works seamlessly across all devices.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ahmad Chairiansyah**

- GitHub: [@amdryankz](https://github.com/amdryankz)

## 🙏 Acknowledgments

- Google Gemini AI for powerful AI capabilities
- Google Maps Platform for mapping services
- The React and Node.js communities
- All contributors and supporters

## 📧 Support

For support, email ahmadchairiansyah@example.com or open an issue in the GitHub repository.

---

Made with ❤️ by Ahmad Chairiansyah
