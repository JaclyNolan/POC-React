import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { isLoggedIn, removeToken } from './auth';
import { useState } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function ProtectedRoute() {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
}

import { useNavigate } from 'react-router-dom';

function Home() {
  const [count, setCount] = useState<number>(0);
  const [pooper, setPooper] = useState<string>('');
  const navigate = useNavigate();
  const callApi = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;
      const response = await axios.get(`${apiBaseUrl}/api/pooper`);
      setPooper(response.data);
    } catch {
      setPooper('Error calling API');
    }
  };
  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <button onClick={callApi} style={{ marginTop: '16px' }}>
          Call .NET API
        </button>
        {pooper && <div style={{ marginTop: '12px', fontWeight: 'bold' }}>{pooper}</div>}
      </div>
      <button onClick={handleLogout} style={{ marginTop: '16px', background: '#d32f2f', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Logout
        </button>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
