# Travel Planner API

Backend API untuk aplikasi Travel Planner yang dibangun dengan Node.js, Express, dan PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Trips](#trips)
  - [Activities](#activities)
  - [Expenses](#expenses)
  - [AI Features](#ai-features)

## ✨ Features

- **User Authentication**: Register, login, dan Google OAuth
- **Trip Management**: CRUD operations untuk trip planning
- **Activity Management**: Organize activities per day dengan drag & drop ordering
- **Expense Tracking**: Track dan categorize expenses per trip/activity
- **AI Integration**:
  - Generate itinerary dengan Gemini AI
  - Route optimization
  - Activity suggestions
  - Place search dan geocoding dengan Google Maps API
- **Statistics**: Trip dan expense analytics

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL dengan Sequelize ORM
- **Authentication**: JWT + bcrypt
- **AI Services**:
  - Google Gemini AI
  - Google Maps API
- **Testing**: Jest + Supertest (91%+ coverage)

## 📦 Installation

```bash
# Install dependencies
npm install
```

## 🔐 Environment Variables

Buat file `.env` di root folder server:

```env
# Database
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME_DEV=travel_planner_dev
DB_NAME_TEST=travel_planner_test

# JWT
JWT_SECRET=your_jwt_secret_key

# Google AI
GEMINI_API_KEY=your_gemini_api_key

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 🗄️ Database Setup

```bash
# Create database
npx sequelize-cli db:create

# Run migrations
npx sequelize-cli db:migrate

# (Optional) Run seeders
npx sequelize-cli db:seed:all
```

## 🚀 Running the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:3000`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test __test__/auth.test.js
```

**Test Coverage:**

- Statements: 98.37%
- Branches: 91.12%
- Functions: 100%
- Lines: 98.46%

---

## 📖 API Documentation

Base URL: `http://localhost:3000/api`

### Authentication

#### Register User

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

#### Login

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "access_token": "jwt_token_here"
}
```

---

#### Google Login

```http
POST /api/auth/google
```

**Request Body:**

```json
{
  "credential": "google_credential_token"
}
```

**Response (200):**

```json
{
  "message": "Google login successful",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://avatar-url.com"
  },
  "access_token": "jwt_token_here"
}
```

---

#### Get Current User

```http
GET /api/me
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://avatar-url.com"
  }
}
```

---

### Trips

#### Get All Trips

```http
GET /api/trips
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `status` (optional): Filter by status (draft, confirmed, completed, cancelled)
- `search` (optional): Search by title or destination

**Response (200):**

```json
{
  "message": "Trips retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "title": "Bali Adventure",
      "destination": "Bali, Indonesia",
      "departureLocation": "Jakarta",
      "startDate": "2025-12-10",
      "endDate": "2025-12-15",
      "budget": 15000000,
      "status": "draft",
      "preferences": {},
      "coverImage": "https://image-url.com",
      "createdAt": "2025-11-13T00:00:00.000Z",
      "updatedAt": "2025-11-13T00:00:00.000Z"
    }
  ]
}
```

---

#### Get Trip by ID

```http
GET /api/trips/:id
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "message": "Trips retrieved successfully",
  "data": {
    "id": "uuid",
    "title": "Bali Adventure",
    "destination": "Bali, Indonesia",
    "startDate": "2025-12-10",
    "endDate": "2025-12-15",
    "budget": 15000000,
    "status": "draft",
    "activities": [
      {
        "id": "uuid",
        "day": 1,
        "title": "Beach Day",
        "location": { "lat": -8.409518, "lng": 115.188919 },
        "startTime": "09:00",
        "endTime": "12:00",
        "category": "activity",
        "cost": 0,
        "order": 0
      }
    ],
    "expenses": [
      {
        "id": "uuid",
        "amount": 150000,
        "category": "food",
        "description": "Lunch",
        "date": "2025-12-10"
      }
    ]
  }
}
```

---

#### Create Trip

```http
POST /api/trips
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "title": "Bali Adventure",
  "destination": "Bali, Indonesia",
  "departureLocation": "Jakarta",
  "startDate": "2025-12-10",
  "endDate": "2025-12-15",
  "budget": 15000000,
  "status": "draft"
}
```

**Response (201):**

```json
{
  "message": "Trip created successfully",
  "data": {
    "id": "uuid",
    "title": "Bali Adventure",
    "destination": "Bali, Indonesia",
    "departureLocation": "Jakarta",
    "startDate": "2025-12-10",
    "endDate": "2025-12-15",
    "budget": 15000000,
    "status": "draft"
  }
}
```

---

#### Update Trip

```http
PUT /api/trips/:id
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "title": "Updated Trip Title",
  "budget": 20000000,
  "status": "confirmed"
}
```

**Response (200):**

```json
{
  "message": "Trip updated successfully",
  "data": {
    "id": "uuid",
    "title": "Updated Trip Title",
    "budget": 20000000,
    "status": "confirmed"
  }
}
```

---

#### Delete Trip

```http
DELETE /api/trips/:id
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "message": "Trip deleted successfully"
}
```

---

#### Get Trip Statistics

```http
GET /api/trips/stats
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "message": "Statistics retrieved successfully",
  "data": {
    "totalTrips": 5,
    "byStatus": {
      "draft": 2,
      "confirmed": 2,
      "completed": 1
    },
    "totalBudget": 75000000,
    "totalExpenses": 50000000
  }
}
```

---

### Activities

#### Get Activities by Trip

```http
GET /api/activities/trip/:tripId
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "message": "Activities retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "tripId": "uuid",
      "day": 1,
      "title": "Beach Day",
      "description": "Relax at the beach",
      "location": {
        "lat": -8.409518,
        "lng": 115.188919,
        "address": "Seminyak Beach, Bali"
      },
      "startTime": "09:00",
      "endTime": "12:00",
      "duration": 180,
      "category": "activity",
      "cost": 0,
      "notes": "Bring sunscreen",
      "order": 0
    }
  ]
}
```

---

#### Get Activity by ID

```http
GET /api/activities/:id
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "message": "Activity retrieved successfully",
  "data": {
    "id": "uuid",
    "tripId": "uuid",
    "day": 1,
    "title": "Beach Day",
    "description": "Relax at the beach",
    "location": { "lat": -8.409518, "lng": 115.188919 },
    "startTime": "09:00",
    "endTime": "12:00",
    "category": "activity",
    "cost": 0,
    "order": 0,
    "trip": {
      "id": "uuid",
      "title": "Bali Adventure"
    }
  }
}
```

---

#### Create Activity

```http
POST /api/activities/trip/:tripId
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "day": 1,
  "title": "Beach Day",
  "description": "Relax at the beach",
  "location": {
    "lat": -8.409518,
    "lng": 115.188919,
    "address": "Seminyak Beach, Bali"
  },
  "startTime": "09:00",
  "endTime": "12:00",
  "category": "activity",
  "cost": 0,
  "order": 0
}
```

**Categories:** `sightseeing`, `food`, `transport`, `hotel`, `activity`, `shopping`, `other`

**Response (201):**

```json
{
  "message": "Activity created successfully",
  "data": {
    "id": "uuid",
    "day": 1,
    "title": "Beach Day",
    "category": "activity",
    "cost": 0
  }
}
```

---

#### Bulk Create Activities

```http
POST /api/activities/trip/:tripId/bulk
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "activities": [
    {
      "day": 1,
      "title": "Activity 1",
      "category": "activity",
      "order": 0
    },
    {
      "day": 1,
      "title": "Activity 2",
      "category": "food",
      "order": 1
    }
  ]
}
```

**Response (201):**

```json
{
  "message": "Activities created successfully",
  "data": [
    {
      "id": "uuid",
      "day": 1,
      "title": "Activity 1"
    },
    {
      "id": "uuid",
      "day": 1,
      "title": "Activity 2"
    }
  ]
}
```

---

#### Update Activity

```http
PUT /api/activities/:id
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "title": "Updated Activity",
  "startTime": "10:00",
  "cost": 150000
}
```

**Response (200):**

```json
{
  "message": "Activity updated successfully",
  "data": {
    "id": "uuid",
    "title": "Updated Activity",
    "startTime": "10:00",
    "cost": 150000
  }
}
```

---

#### Reorder Activities

```http
POST /api/activities/reorder
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "activities": [
    {
      "id": "uuid-1",
      "order": 0
    },
    {
      "id": "uuid-2",
      "order": 1
    }
  ]
}
```

**Response (200):**

```json
{
  "message": "Activities reordered successfully",
  "data": [
    {
      "id": "uuid-1",
      "order": 0
    },
    {
      "id": "uuid-2",
      "order": 1
    }
  ]
}
```

---

#### Delete Activity

```http
DELETE /api/activities/:id
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "message": "Activity deleted successfully"
}
```

---

### Expenses

#### Get Expenses by Trip

```http
GET /api/expenses/trip/:tripId
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `category` (optional): Filter by category
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date

**Response (200):**

```json
{
  "message": "Expenses retrieved successfully",
  "data": {
    "expenses": [
      {
        "id": "uuid",
        "tripId": "uuid",
        "activityId": "uuid",
        "amount": 150000,
        "category": "food",
        "description": "Lunch at restaurant",
        "date": "2025-12-10",
        "activity": {
          "id": "uuid",
          "title": "Beach Day",
          "day": 1
        }
      }
    ],
    "summary": {
      "total": 150000,
      "byCategory": {
        "food": 150000
      },
      "count": 1
    }
  }
}
```

---

#### Get Expense by ID

```http
GET /api/expenses/:id
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "message": "Expense retrieved successfully",
  "data": {
    "id": "uuid",
    "tripId": "uuid",
    "activityId": "uuid",
    "amount": 150000,
    "category": "food",
    "description": "Lunch",
    "date": "2025-12-10",
    "trip": {
      "id": "uuid",
      "title": "Bali Adventure"
    },
    "activity": {
      "id": "uuid",
      "title": "Beach Day"
    }
  }
}
```

---

#### Create Expense

```http
POST /api/expenses/trip/:tripId
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "activityId": "uuid",
  "amount": 150000,
  "category": "food",
  "description": "Lunch at restaurant",
  "date": "2025-12-10"
}
```

**Categories:** `accommodation`, `food`, `transportation`, `activities`, `shopping`, `other`

**Response (201):**

```json
{
  "message": "Expense created successfully",
  "data": {
    "id": "uuid",
    "amount": 150000,
    "category": "food",
    "description": "Lunch at restaurant"
  }
}
```

---

#### Bulk Create Expenses

```http
POST /api/expenses/trip/:tripId/bulk
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "expenses": [
    {
      "amount": 150000,
      "category": "food",
      "description": "Lunch",
      "date": "2025-12-10"
    },
    {
      "amount": 50000,
      "category": "transportation",
      "description": "Taxi",
      "date": "2025-12-10"
    }
  ]
}
```

**Response (201):**

```json
{
  "message": "Expenses created successfully",
  "data": [
    {
      "id": "uuid",
      "amount": 150000,
      "category": "food"
    },
    {
      "id": "uuid",
      "amount": 50000,
      "category": "transportation"
    }
  ]
}
```

---

#### Update Expense

```http
PUT /api/expenses/:id
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "amount": 200000,
  "description": "Updated description"
}
```

**Response (200):**

```json
{
  "message": "Expense updated successfully",
  "data": {
    "id": "uuid",
    "amount": 200000,
    "description": "Updated description"
  }
}
```

---

#### Delete Expense

```http
DELETE /api/expenses/:id
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "message": "Expense deleted successfully"
}
```

---

#### Get Expense Statistics

```http
GET /api/expenses/trip/:tripId/stats
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response (200):**

```json
{
  "message": "Statistics retrieved successfully",
  "data": {
    "total": 500000,
    "byCategory": {
      "food": 300000,
      "transportation": 100000,
      "activities": 100000
    },
    "byDay": {
      "1": 200000,
      "2": 150000,
      "3": 150000
    },
    "count": 15,
    "average": 33333.33
  }
}
```

---

### AI Features

#### Generate Itinerary

```http
POST /api/ai/generate-itinerary
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "destination": "Bali, Indonesia",
  "duration": 5,
  "interests": ["beach", "culture", "food"],
  "budget": "medium"
}
```

**Response (200):**

```json
{
  "message": "Itinerary generated successfully",
  "data": {
    "itinerary": [
      {
        "day": 1,
        "activities": [
          {
            "time": "09:00",
            "title": "Visit Tanah Lot Temple",
            "description": "Ancient Hindu shrine on a rock formation",
            "duration": 120,
            "estimatedCost": 20000
          }
        ]
      }
    ],
    "estimatedBudget": 5000000,
    "tips": ["Bring sunscreen", "Book hotels in advance"]
  }
}
```

---

#### Optimize Route

```http
POST /api/ai/optimize-route
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "origin": "Seminyak, Bali",
  "waypoints": ["Tanah Lot Temple", "Uluwatu Temple", "Jimbaran Beach"],
  "destination": "Seminyak, Bali"
}
```

**Response (200):**

```json
{
  "message": "Route optimized successfully",
  "data": {
    "optimizedOrder": [
      "Tanah Lot Temple",
      "Uluwatu Temple",
      "Jimbaran Beach"
    ],
    "totalDistance": "45 km",
    "totalDuration": "2 hours 30 mins",
    "route": {
      "coordinates": [[lat, lng], [lat, lng]],
      "legs": [
        {
          "from": "Seminyak",
          "to": "Tanah Lot Temple",
          "distance": "15 km",
          "duration": "30 mins"
        }
      ]
    }
  }
}
```

---

#### Get Activity Suggestions

```http
POST /api/ai/suggestions
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "tripId": "uuid",
  "day": 1,
  "preferences": ["beach", "culture"]
}
```

**Response (200):**

```json
{
  "message": "Suggestions retrieved successfully",
  "data": {
    "suggestions": [
      {
        "title": "Visit Seminyak Beach",
        "description": "Beautiful beach with great surfing",
        "category": "activity",
        "estimatedDuration": 180,
        "estimatedCost": 0,
        "location": {
          "lat": -8.409518,
          "lng": 115.188919,
          "address": "Seminyak Beach, Bali"
        },
        "rating": 4.5,
        "reviews": 1234
      }
    ]
  }
}
```

---

#### Geocode Address

```http
POST /api/ai/geocode
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "address": "Tanah Lot Temple, Bali"
}
```

**Response (200):**

```json
{
  "message": "Geocoding successful",
  "data": {
    "lat": -8.621229,
    "lng": 115.086844,
    "formattedAddress": "Tanah Lot, Beraban, Kediri, Tabanan Regency, Bali, Indonesia",
    "placeId": "ChIJxxxxxx"
  }
}
```

---

#### Calculate Distance

```http
POST /api/ai/distance
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "origin": "Seminyak, Bali",
  "destination": "Tanah Lot Temple, Bali"
}
```

**Response (200):**

```json
{
  "message": "Distance calculated successfully",
  "data": {
    "distance": "15.2 km",
    "duration": "32 mins",
    "distanceValue": 15200,
    "durationValue": 1920
  }
}
```

---

#### Search Places

```http
POST /api/ai/places
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "query": "restaurants in Seminyak",
  "location": {
    "lat": -8.409518,
    "lng": 115.188919
  },
  "radius": 5000
}
```

**Response (200):**

```json
{
  "message": "Places retrieved successfully",
  "data": {
    "places": [
      {
        "name": "La Lucciola",
        "address": "Jl. Kayu Aya, Seminyak",
        "location": {
          "lat": -8.409518,
          "lng": 115.188919
        },
        "rating": 4.5,
        "priceLevel": 3,
        "types": ["restaurant", "food"],
        "placeId": "ChIJxxxxxx"
      }
    ]
  }
}
```

---

## 🔒 Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "message": "Forbidden"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Internal server error"
}
```

---

## 📝 Notes

- Semua endpoint (kecuali authentication) memerlukan JWT token di header `Authorization: Bearer <token>`
- UUID format digunakan untuk semua ID
- Semua timestamp menggunakan ISO 8601 format
- Budget dan amount dalam Indonesian Rupiah (IDR)
- AI features memerlukan API key yang valid untuk Gemini AI dan Google Maps

---

**Happy Coding! 🚀**
