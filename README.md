# Contest Tracker

A web application that tracks and displays upcoming and past coding contests from popular platforms like CodeChef, CodeForces, and LeetCode.

## Overview

Contest Tracker is a full-stack web application that provides users with a centralized platform to view coding contest information. The application fetches contest details from public APIs and presents them in an organized and user-friendly interface.

## Screenshots

### Home Page
![Home Page](https://res.cloudinary.com/dhjzu51mb/image/upload/v1742133063/contesttracker/ow7m39rtzarbz3jld0dx.png)
*Contest Tracker home page displaying upcoming contests*

### Responsive View
![Contest Detail](https://res.cloudinary.com/dhjzu51mb/image/upload/v1742133285/contesttracker/pkczuidb9zqtkcbl6sg8.png)
*Detailed view of dark mode mobile view*

### Platform Filter
![Platform Filter](https://res.cloudinary.com/dhjzu51mb/image/upload/v1742133183/contesttracker/j5d4tyenw8kba4ngtp9u.png)
*Filtering contests by platform*

### Video Demo
https://res.cloudinary.com/dhjzu51mb/video/upload/v1742140777/contesttracker/hl6lvgb70fnbkqy9rdwg.mp4
*Navigate to the link to see the Video demonstration of the Contest Tracker application*


## Features

- View upcoming and past contests from CodeChef, CodeForces, and LeetCode
- Filter contests by platform
- Sort contests by date, duration, or platform
- Responsive design for optimal viewing on any device
- RESTful API for accessing contest data
- Dark mode toggle
- User authentication
## Tech Stack

### Frontend
- Next.js with TypeScript (App Router)
- Tailwind CSS for styling
- Responsive design

### Backend
- Node.js
- Express.js
- MongoDB for data storage
- RESTful API architecture

## Project Structure

```
contest-tracker/
├── client/                     # Frontend code
│   ├── public/
│   ├── src/
│   │   ├── app/                # App Router structure
│   │   │   ├── layout.tsx      # Root layout
│   │   │   ├── page.tsx        # Home page
│   │   │   └── [...]/          # Other routes
│   │   ├── components/         # Reusable UI components
│   │   ├── lib/                # Utility functions
│   │   └── styles/             # Tailwind CSS configuration
│   ├── package.json
│   └── tsconfig.json
│
├── server/                     # Backend code
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API routes
│   │   └── utils/              # Utility functions
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js (v16.8 or later recommended for App Router)
- MongoDB
- npm or yarn

### Frontend Setup
  1. Navigate to the client directory
     ```
        cd client
      ```

  2. Install dependencies
      ```
       npm install
      ```

   3. Frontend (client/.env)
    - `NEXT_PUBLIC_CLIST_API_KEY`: API key for Clist.by to fetch contest information
    - `NEXT_PUBLIC_CLIST_USERNAME`: Your github username
    - `NEXT_PUBLIC_YOUTUBE_API_KEY`: YouTube API key for video content (if applicable)
    - `NEXT_PUBLIC_API_URL`: URL for your backend server

4. Start the development server
   ```
   npm run dev
   ```

### Backend Setup
1. Navigate to the server directory
   ```
   cd server
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Backend (server/.env)
    - `MONGO_URI`: MongoDB connection string (use MongoDB Atlas for production)
    - `PORT`: Port number for the server to run on
    - `JWT_SECRET`: Secret key for JWT token generation and verification
    - `ADMIN_EMAIL`: Email for admin account
    - `ADMIN_PASSWORD`: Password for admin account

4. Start the server
   ```
   npm run dev
   ```

## API Documentation

Check Out the whole API Documentation in Postman
https://documenter.getpostman.com/view/42708522/2sAYkBtMaq

## Data Source

This application uses the [Clist API](https://clist.by/api/v1/contest/) to fetch programming contest information. Clist.by is a comprehensive platform that aggregates competitive programming contests from various online platforms. 



## Deployment

### Frontend
The frontend can be deployed on Vercel or any other Next.js-compatible hosting service.

```
cd client
npm run build
```

### Backend
The backend can be deployed on Heroku, Render, or any other Node.js-compatible hosting service.

```
cd server
npm run build
```

## Next.js App Router Features Used

- Server Components
- Client Components with "use client" directive
- Route Groups
- Data Fetching within components
- Layout patterns for consistent UI
- Server-side rendering and static generation
- API Routes with Route Handlers
