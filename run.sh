#!/bin/bash

echo "Starting Phish-Scale Cloudflare Worker locally..."

# Ensure we are in the directory where this script is located
cd "$(dirname "$0")"

# Check if wrangler is installed globally or locally
if ! command -v npx &> /dev/null
then
    echo "Error: npm/npx is not installed. Please install Node.js first."
    exit 1
fi

# Run wrangler
echo "Running: npx wrangler dev"
npx wrangler dev
