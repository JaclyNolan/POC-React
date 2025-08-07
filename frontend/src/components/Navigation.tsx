import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

interface NavButtonProps {
  to: string;
  children: React.ReactNode;
}

function NavButton({ to, children }: NavButtonProps) {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate(to)}
      sx={{ mr: 1 }}
    >
      {children}
    </Button>
  );
}

export default function Navigation() {
  return (
    <Box sx={{ mb: 3 }}>
      <NavButton to={ROUTES.ITEMS}>Items</NavButton>
      <NavButton to={ROUTES.VEHICLES}>Vehicles</NavButton>
    </Box>
  );
}
