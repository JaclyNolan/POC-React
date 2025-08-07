import { Navigate, RouteObject } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import Login from '../Login';
import Register from '../Register';
import { isLoggedIn } from '../auth';
import Home from '../pages/Home';
import VehicleTable from '../components/VehicleTable';
import ItemTable from '../components/ItemTable';

// HOC for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isLoggedIn() ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
};

// Define public routes
const publicRoutes: RouteObject[] = [
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
  },
];

// Define protected routes
const protectedRoutes: RouteObject[] = [
  {
    path: ROUTES.HOME,
    element: <Home />,
    children: [
      {
        path: ROUTES.ITEMS,
        element: <ItemTable />,
      },
      {
        path: ROUTES.VEHICLES,
        element: <VehicleTable />,
      },
    ],
  },
];

// Wrap protected routes with authentication check
const wrappedProtectedRoutes: RouteObject[] = protectedRoutes.map((route) => ({
  ...route,
  element: <ProtectedRoute>{route.element}</ProtectedRoute>,
}));

// Combine all routes
export const routes: RouteObject[] = [
  ...publicRoutes,
  ...wrappedProtectedRoutes,
  {
    path: '*',
    element: <Navigate to={ROUTES.HOME} replace />,
  },
];
