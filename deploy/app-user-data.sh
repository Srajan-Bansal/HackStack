#!/bin/bash
# User data script for App EC2 instances (Launch Template).
# This runs on every boot to pull latest images and start services.
# Instance type: t3.small (2GB RAM for 3 containers)
# Security group: hackstack-app-sg

set -euo pipefail

# Install Docker + Compose (only runs on first boot, idempotent)
if ! command -v docker &> /dev/null; then
  dnf update -y && dnf install -y docker git
  systemctl enable docker
fi
systemctl start docker
usermod -aG docker ec2-user 2>/dev/null || true

if ! command -v docker-compose &> /dev/null; then
  curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
fi

# Set up app directory
APP_DIR=/home/ec2-user/app
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# Clone problems repo if not present (needed as volume mount)
if [ ! -d hackstack-problems ]; then
  git clone https://github.com/Srajan-Bansal/hackstack-problems.git
else
  cd hackstack-problems && git pull && cd ..
fi

# Pull latest images and start services
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
