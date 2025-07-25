
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from './auth';
import { Box, Button, TextField, Typography, Alert, Link, Paper } from '@mui/material';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;
      const res = await axios.post(`${apiBaseUrl}/auth/login`, { username, password });
      setToken(res.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data || err.message || 'Login failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" align="center" gutterBottom>Login</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Box mt={2} textAlign="center">
            <Link href="/register" underline="hover">Register</Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
