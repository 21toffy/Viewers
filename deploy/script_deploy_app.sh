#!/bin/bash

# Configuration
EC2_USER="ubuntu"
EC2_HOST="18.175.220.131"
FRONTEND_REPO_DIR="/var/www/html/Viewers"  # Directory where the repo is cloned
FRONTEND_BUILD_DIR="$FRONTEND_REPO_DIR/platform/app/dist"
NGINX_CONF="/etc/nginx/sites-available/Viewers"
NGINX_ENABLED="/etc/nginx/sites-enabled/Viewers"
RETRIES=3
DELAY=5

# Function for retries
retry() {
    local n=1
    local max=$RETRIES
    local delay=$DELAY
    while true; do
        "$@" && break || {
            if [[ $n -lt $max ]]; then
                ((n++))
                echo "Command failed. Attempt $n/$max in $delay seconds..."
                sleep $delay
            else
                echo "Command failed after $max attempts."
                return 1
            fi
        }
    done
}

# # Step 1: Pull the latest changes from the GitHub repository
# echo "Pulling the latest changes from the GitHub repository..."
# retry ssh $EC2_USER@$EC2_HOST "cd $FRONTEND_REPO_DIR && git pull origin main"

# Step 2: Build the frontend application
# echo "Building the frontend application..."
# retry ssh $EC2_USER@$EC2_HOST "cd $FRONTEND_REPO_DIR

retry sudo yarn config set workspaces-experimental true && sudo yarn install && sudo yarn build

# Step 3: Configure NGINX (run once, check if already configured)
echo "Setting up NGINX configuration if it's not already set up..."
if [ ! -f "$NGINX_ENABLED" ]; then
    NGINX_CONFIG="server {
        listen 80;
        server_name $EC2_HOST;

        root $FRONTEND_BUILD_DIR;
        index index.html;

        location / {
            try_files \$uri /index.html;
        }

        location /static {
            alias $FRONTEND_BUILD_DIR;
        }
    }"

    # Create NGINX config and enable it
    retry "echo '$NGINX_CONFIG' | sudo tee $NGINX_CONF"
    retry "sudo ln -sf $NGINX_CONF $NGINX_ENABLED"
    echo "NGINX configuration has been set up."
else
    echo "NGINX configuration already exists. Skipping NGINX setup."
fi

# Step 4: Reload NGINX to serve the updated frontend
echo "Reloading NGINX to apply changes..."
retry "sudo nginx -t && sudo systemctl reload nginx"

echo "Frontend application successfully built and deployed!"
