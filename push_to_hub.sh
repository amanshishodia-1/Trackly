#!/bin/bash
USERNAME="amanshishodia"

echo "🔨 Building images..."
docker build -t $USERNAME/trackly-backend:latest ./backend
docker build -t $USERNAME/trackly-frontend:latest ./frontend

echo "🔐 Pushing to Docker Hub..."
docker push $USERNAME/trackly-backend:latest
docker push $USERNAME/trackly-frontend:latest

echo "✅ All images pushed successfully!"
