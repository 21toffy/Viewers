#!/usr/bin/env bash




# Function to start the frontend application
start_application() {
    echo "Configuring Yarn workspaces..."
    yarn config set workspaces-experimental true || { echo "Failed to set Yarn workspace configuration"; exit 1; }

    echo "Installing dependencies..."
    yarn install || { echo "Failed to install dependencies"; exit 1; }

    echo "Starting the application environment..."
    yarn dev || { echo "Failed to start the development server"; exit 1; }
}


start_application
fi
