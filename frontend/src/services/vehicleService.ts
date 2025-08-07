import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Vehicle, VehicleFormValues, VehicleResponse } from '../types/vehicle';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;

export const useVehicles = (page: number, limit: number) => {
    return useQuery<VehicleResponse>({
        queryKey: ['vehicles', page, limit],
        queryFn: async () => {
            const res = await axios.get(`${apiBaseUrl}/api/vehicles?page=${page}&limit=${limit}`);
            return res.data;
        },
    });
};

export const useCreateVehicle = () => {
    const queryClient = useQueryClient();

    return useMutation<Vehicle, Error, VehicleFormValues>({
        mutationFn: async (values: VehicleFormValues) => {
            const res = await axios.post(`${apiBaseUrl}/api/vehicles`, values);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};

export const useUpdateVehicle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, values }: { id: string; values: VehicleFormValues }) => {
            const res = await axios.put(`${apiBaseUrl}/api/vehicles/${id}`, values);
            return res.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};

export const useDeleteVehicle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`${apiBaseUrl}/api/vehicles/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};
