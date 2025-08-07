export interface Vehicle {
  id: string;
  licensePlate: string;
  status: 'Active' | 'Maintenance' | 'Retired';
  type: 'Truck' | 'Van' | 'Trailer';
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFormValues {
  licensePlate: string;
  status: 'Active' | 'Maintenance' | 'Retired';
  type: 'Truck' | 'Van' | 'Trailer';
}

export interface VehicleResponse {
  vehicles: Vehicle[];
  total: number;
}
