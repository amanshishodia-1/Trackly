#!/bin/bash

# Configuration
EC2_IP="51.21.201.213"
PEM_PATH="/Users/amanshishodia/Downloads/tra.pem"
REPO_URL="https://github.com/amanshishodia-1/Trackly.git"
BRANCH="docker-step-1"

echo "🚀 Starting deployment to AWS ($EC2_IP)..."

# Ensure the key has correct permissions
chmod 400 "$PEM_PATH"

# Run commands on the remote server
ssh -i "$PEM_PATH" -o StrictHostKeyChecking=no ec2-user@$EC2_IP << EOF
    set -e
    echo "Successfully connected to EC2!"

    # 1. Install Docker & Docker Compose if not present
    if ! command -v docker &> /dev/null; then
        echo "Installing Docker..."
        sudo dnf update -y
        sudo dnf install docker -y
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker ec2-user
    fi

    if ! command -v docker-compose &> /dev/null; then
        echo "Installing Docker Compose..."
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi

    # 2. Clone or Update Repository
    if [ ! -d "Trackly" ]; then
        echo "Cloning repository..."
        git clone -b $BRANCH $REPO_URL
        cd Trackly
    else
        echo "Updating repository..."
        cd Trackly
        git pull origin $BRANCH
    fi

    # 3. Deploy Stack (Using Production Images)
    echo "Starting containers..."
    docker-compose -f docker-compose.prod.yml up -d

    echo "✅ Deployment complete! App should be live at http://$EC2_IP"
EOF
