# How to Start the Application

## Every Time You Want to Run the App

### 1. Start MySQL (if not already running)
```bash
brew services start mysql
# Or: mysql.server start
```

### 2. Start Spring Boot Backend (Terminal 1)
```bash
cd /Users/sirisanjana/Downloads/demo
./mvnw spring-boot:run
```
Wait for: `Started DemoApplication in X seconds`

### 3. Start Frontend (Terminal 2)
```bash
cd /Users/sirisanjana/Documents/Erumai/wezume-app
npm run dev
```

### 4. Open Browser
Navigate to: **http://localhost:5173**

---

## Quick Check

**Backend running?**
```bash
curl http://localhost:8000/api/scores
```

**Frontend running?**
Open browser: `http://localhost:5173`

---

## Stop Everything

1. `Ctrl+C` in Terminal 1 (Spring Boot)
2. `Ctrl+C` in Terminal 2 (Frontend)
3. `brew services stop mysql` (optional)
