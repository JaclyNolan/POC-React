export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VEHICLES: '/vehicles',
  ITEMS: '/items',
} as const;

// Type for route paths
export type RoutePath = typeof ROUTES[keyof typeof ROUTES];
