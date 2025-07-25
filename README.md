# React & .NET Simple Project

This workspace contains a Vite-based React frontend and an ASP.NET Core Web API backend.

## Project Structure
- `frontend/` - React app (Vite)
- `backend/` - ASP.NET Core Web API

## How to Run

### 1. Start the Backend (API)
Open a terminal in the `backend` folder and run:

```
dotnet run
```

The API will be available at `http://localhost:5000` (or the port shown in the terminal).

### 2. Start the Frontend (React)
Open a terminal in the `frontend` folder and run:

```
npm run dev
```

The React app will be available at the URL shown in the terminal (usually `http://localhost:5173`).

---

## Notes
- Make sure you have Node.js (v18+) and .NET 8 SDK installed.
- The frontend and backend run independently.
- You can connect the frontend to the backend by using the backend's URL in your React code (e.g., for API calls).
