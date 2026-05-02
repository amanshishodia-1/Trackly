# Deployment Guide: Vercel (Frontend) + Render (Backend)

This guide explains how to deploy your Trackly application using Vercel for the React frontend and Render for the Node.js backend.

## 1. Backend Deployment (Render)

1.  **Create a Web Service**: In Render, create a new "Web Service" and connect your repository.
2.  **Configuration**:
    *   **Root Directory**: `backend`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
3.  **Environment Variables**:
    *   `MONGO_URI`: Your MongoDB Atlas connection string.
    *   `JWT_SECRET`: A secure random string.
    *   `CLIENT_URL`: Your Vercel frontend URL (e.g., `https://trackly.vercel.app`).
    *   `PORT`: `3000`

## 2. Frontend Deployment (Vercel)

1.  **Import Project**: In Vercel, import your repository.
2.  **Configuration**:
    *   **Framework Preset**: `Vite`
    *   **Root Directory**: `frontend`
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
3.  **Environment Variables**:
    *   `VITE_API_URL`: Your Render backend URL + `/api` (e.g., `https://trackly-backend.onrender.com/api`).
    *   `VITE_SOCKET_URL`: Your Render backend URL (e.g., `https://trackly-backend.onrender.com`).

---

## 🛠️ Recent Code Adjustments Made
I have already made the following changes to prepare your code for this setup:
1.  **Axios Configuration**: Updated `frontend/src/lib/axios.js` to use the `VITE_API_URL` environment variable.
2.  **SPA Routing**: Added `frontend/vercel.json` to ensure page refreshes work correctly on Vercel.
3.  **CORS**: Confirmed `backend/server.js` uses `CLIENT_URL` for secure cross-origin requests.

## ✅ Verification
Once both are deployed:
1.  Visit your Vercel URL.
2.  Check the "Network" tab in your browser's Developer Tools to ensure requests are going to the Render URL.
3.  Verify that real-time updates (Socket.IO) are working.
