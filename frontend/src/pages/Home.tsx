import { Box, Button } from '@mui/material';
import { useNavigate, Outlet } from 'react-router-dom';
import { removeToken } from '../auth';
import { ROUTES } from '../constants/routes';
import Navigation from '../components/Navigation';

export default function Home() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    removeToken();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          onClick={handleLogout}
          variant="contained"
          color="error"
        >
          Logout
        </Button>
      </Box>
      <Navigation />
      <Outlet />
    </Box>
  );
}
