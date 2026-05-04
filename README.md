# Trackly

Trackly is a high-performance, premium issue tracking system inspired by the minimalist and keyboard-first philosophy of Linear. Built with the MERN stack, it offers a seamless experience for teams to manage tasks, projects, and cycles with speed and clarity.

## ✨ Features

- **Premium UI/UX**: Minimalist, high-contrast interface with ambient background effects, refined typography, and glassmorphism.
- **Issue Tracking**: Fast, intuitive management of issues with custom statuses, priorities, and assignees.
- **Workspace Management**: Automated personal workspace creation upon signup with customizable settings.
- **Projects & Teams**: Group related issues into initiatives and collaborate seamlessly across different team structures.
- **Appearance System**: Advanced customization including Light, Dark, and System theme support, alongside "Comfortable" and "Compact" interface density modes.
- **Global Search**: Powerful command-center style search to navigate and find issues instantly.
- **Real-time Polish**: Fluid micro-interactions and layout transitions powered by Framer Motion.
- **Inbox & Activity**: Stay updated on relevant changes with a dedicated notification center.

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Authentication, Bcrypt.js
- **Deployment**: Configured for Vercel (Frontend) and Render (Backend).

## 📦 Project Structure

```
├── backend/
│   ├── models/        # Mongoose schemas (User, Workspace, Team, Project, etc.)
│   ├── routes/        # API endpoints (Auth, Settings, Workspace, Issues)
│   ├── middleware/    # Auth protection and error handling
│   └── server.js      # Entry point
└── frontend/
    ├── src/
    │   ├── components/# Atomic components and landing page modules
    │   ├── context/   # Global state (Auth, Theme, Search)
    │   ├── layouts/   # Dashboard and Authentication layouts
    │   ├── pages/     # Main feature views (Dashboard, Settings, Pricing)
    │   ├── lib/       # API configuration and utilities
    │   └── assets/    # Static assets and design tokens
    └── index.html     # Entry point with optimized theme-flash prevention
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (Local instance or Atlas URI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amanshishodia-1/Trackly.git
   cd Trackly
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

## 🔐 API Reference

### Authentication
- `POST /api/auth/register` - Create account and auto-initialize workspace
- `POST /api/auth/login` - Authenticate and receive JWT
- `GET /api/auth/me` - Get current authenticated user

### Settings & Workspace
- `GET /api/settings/appearance` - Get theme/density preferences
- `PATCH /api/settings/appearance` - Update appearance settings
- `PATCH /api/settings/profile` - Update user profile and timezone
- `GET /api/workspace/me` - Get current workspace details

## 📄 License

Built for high-performance teams. © 2026 Trackly Inc.
