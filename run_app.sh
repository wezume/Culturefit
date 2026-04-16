#!/bin/bash

# Wezume Application Starter Script

echo "🚀 Starting Wezume Application..."

# 1. Start MySQL (if using Homebrew)
if command -v brew &> /dev/null; then
    echo "📦 Checking MySQL status..."
    brew services start mysql
else
    echo "⚠️  Brew not found. Please ensure MySQL is running manually."
fi

# 2. Start Spring Boot Backend in background
echo "☕ Starting Spring Boot Backend (Port 8000)..."
./mvnw spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!

# 3. Start React Frontend in background
echo "⚛️  Starting React Frontend (Port 5173)..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "✅ Application is starting!"
echo "📡 Backend Log: backend.log"
echo "📡 Frontend Log: frontend.log"
echo "🌐 Frontend URL: http://localhost:5173"
echo "🛑 To stop both: kill $BACKEND_PID $FRONTEND_PID"

# Wait for user to press Ctrl+C to stop everything
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
