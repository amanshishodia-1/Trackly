# Render Deployment Guide

## Prerequisites
- GitHub repository with the Linear project
- Render account (free tier available)
- All code committed to `main` branch

## Step 1: Prepare Your Repository

1. **Push all changes to GitHub:**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Ensure repository structure:**
   ```
   linear/
   ├── backend/
   │   ├── Dockerfile (existing)
   │   ├── Dockerfile.render (for Render)
   │   ├── .env.production
   │   └── ...
   ├── frontend/
   │   ├── Dockerfile (existing)
   │   ├── Dockerfile.render (for Render)
   │   └── ...
   ├── docker-compose.yml
   ├── render.yaml
   └── DEPLOYMENT.md
   ```

## Step 2: Deploy MongoDB Database

1. **Create MongoDB Service:**
   - Go to Render Dashboard → New → PostgreSQL (choose MongoDB alternative)
   - Or use the `mongodb` service defined in `render.yaml`
   - **Service Name:** `mongodb`
   - **Plan:** Starter
   - **Region:** Oregon (or your preferred region)
   - **Database Name:** `trackly`
   - **User:** `admin`

2. **Get Connection Details:**
   - Once deployed, note the **Internal Connection URL**
   - Save the **password** for the admin user

## Step 3: Deploy Backend API

1. **Create Web Service:**
   - Render Dashboard → New → Web Service
   - **Connect:** Your GitHub repository
   - **Name:** `trackly-backend`
   - **Environment:** Docker
   - **Root Directory:** `backend`
   - **Dockerfile Path:** `Dockerfile.render`
   - **Branch:** `main`
   - **Plan:** Starter

2. **Configure Environment Variables:**
   ```bash
   PORT=3000
   NODE_ENV=production
   MONGO_URI=mongodb://admin:PASSWORD@mongodb:27017/trackly?authSource=admin
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   CLIENT_URL=https://trackly-frontend.onrender.com
   ```

3. **Configure Health Check:**
   - **Path:** `/health`
   - **Port:** `3000`
   - **Interval:** 30s
   - **Timeout:** 5s

4. **Add Service Dependency:**
   - Add `mongodb` as a dependency

## Step 4: Deploy Frontend

1. **Create Web Service:**
   - Render Dashboard → New → Web Service
   - **Connect:** Your GitHub repository
   - **Name:** `trackly-frontend`
   - **Environment:** Docker
   - **Root Directory:** `frontend`
   - **Dockerfile Path:** `Dockerfile.render`
   - **Branch:** `main`
   - **Plan:** Starter

2. **Configure Environment Variables:**
   ```bash
   VITE_API_URL=/api
   VITE_SOCKET_URL=https://trackly-backend.onrender.com
   NODE_ENV=production
   ```

3. **Configure Health Check:**
   - **Path:** `/`
   - **Port:** `80`
   - **Interval:** 30s
   - **Timeout:** 5s

## Step 5: Configure Custom Domain (Optional)

1. **Update Frontend Environment:**
   - In frontend service settings, add custom domain
   - Update `CLIENT_URL` in backend to match custom domain

2. **Update Frontend Build Variables:**
   - `VITE_API_URL=https://your-custom-domain.com/api`
   - `VITE_SOCKET_URL=https://your-backend.onrender.com`

## Step 6: Test Deployment

1. **Verify Backend:**
   ```bash
   curl https://trackly-backend.onrender.com/health
   # Expected: {"status":"ok"}
   ```

2. **Verify Frontend:**
   - Visit `https://trackly-frontend.onrender.com`
   - Should load the application

3. **Test Registration:**
   - Create a test account
   - Verify database persistence

## Environment Variables Summary

### Backend (`trackly-backend`)
| Variable | Value | Description |
|----------|-------|-------------|
| `PORT` | `3000` | Application port |
| `NODE_ENV` | `production` | Environment |
| `MONGO_URI` | `mongodb://admin:PASS@mongodb:27017/trackly?authSource=admin` | Database connection |
| `JWT_SECRET` | `generated` | JWT signing key |
| `JWT_EXPIRE` | `7d` | Token expiration |
| `CLIENT_URL` | `https://trackly-frontend.onrender.com` | Frontend URL |

### Frontend (`trackly-frontend`)
| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `/api` | API endpoint |
| `VITE_SOCKET_URL` | `https://trackly-backend.onrender.com` | Socket.IO URL |
| `NODE_ENV` | `production` | Environment |

## Health Checks

### Backend Health Check
- **Endpoint:** `/health`
- **Method:** GET
- **Response:** `{"status":"ok"}`
- **Port:** 3000

### Frontend Health Check
- **Endpoint:** `/`
- **Method:** GET
- **Response:** HTML page
- **Port:** 80

## Persistent Storage

- **MongoDB Data:** Automatically persisted by Render's disk service
- **Disk Size:** 10GB (configurable)
- **Mount Path:** `/data/db`

## Troubleshooting

### Common Issues:

1. **Backend can't connect to MongoDB:**
   - Check MongoDB service is running
   - Verify connection string format
   - Ensure service dependency is configured

2. **Frontend can't reach backend:**
   - Check CORS configuration
   - Verify API URL in environment variables
   - Ensure backend is deployed and healthy

3. **Build failures:**
   - Check Dockerfile paths
   - Verify all files are committed to Git
   - Review build logs for specific errors

### Monitoring:
- Use Render's logs to monitor services
- Check health check status in dashboard
- Monitor resource usage on starter plan

## Post-Deployment

1. **Update DNS records** if using custom domain
2. **Configure SSL certificates** (automatic on Render)
3. **Set up monitoring alerts**
4. **Backup strategy** (Render handles this automatically)
5. **Scale resources** as needed

## Cost Estimate (Free Tier)

- **MongoDB:** ~$7/month (starter plan)
- **Backend:** ~$7/month (starter plan)
- **Frontend:** ~$7/month (starter plan)
- **Total:** ~$21/month (or use free tier credits)

## Security Notes

- All services use HTTPS automatically
- Environment variables are encrypted
- Database is not publicly accessible
- Use strong JWT secrets in production
- Regularly update dependencies
