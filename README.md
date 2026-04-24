# MERN Authentication System with Workspaces

A full-stack authentication system built with MongoDB, Express, React, and Node.js featuring:

- JWT-based authentication
- Automatic workspace creation on signup
- Linear-inspired sidebar dashboard
- Protected routes

## Features

- **Authentication**: Register, Login, Logout with JWT
- **Workspace**: Each user gets a personal workspace on signup
- **Dashboard**: Linear-inspired dark UI with sidebar navigation
- **Pages**: Inbox, My Issues, Projects, Teams

## Database Models

### User
- name
- email
- password
- workspaceId

### Workspace
- name
- owner
- members[]

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas URI

### Installation

1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Set up Environment Variables**
Edit `backend/.env` with your MongoDB URI and JWT secret:
```
MONGODB_URI=mongodb://localhost:27017/mern_auth
JWT_SECRET=your_secret_key
```

### Running the Application

1. **Start the Backend** (from backend directory):
```bash
npm run dev
```
Server runs on http://localhost:5000

2. **Start the Frontend** (from frontend directory):
```bash
npm run dev
```
App runs on http://localhost:3000

## Project Structure

```
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Workspace.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── workspace.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Sidebar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── layouts/
    │   │   └── DashboardLayout.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── dashboard/
    │   │       ├── Inbox.jsx
    │   │       ├── MyIssues.jsx
    │   │       ├── Projects.jsx
    │   │       └── Teams.jsx
    │   ├── lib/
    │   │   └── axios.js
    │   ├── App.jsx
    │   └── main.jsx
    └── index.html
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user with workspace
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Workspace
- `GET /api/workspace/me` - Get user's workspace (protected)
- `PUT /api/workspace/:id` - Update workspace (protected, owner only)

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs
- **Frontend**: React, Vite, React Router, Axios, Tailwind CSS, Lucide Icons
# Trackly
