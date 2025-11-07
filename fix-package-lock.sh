#!/bin/bash
# Script to fix package-lock.json sync issues

echo "Fixing frontend package-lock.json..."
cd frontend
npm install
cd ..

echo "Fixing backend package-lock.json..."
cd backend
npm install
cd ..

echo "Done! Now commit and push the updated package-lock.json files"


