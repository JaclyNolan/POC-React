import { useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Vehicle, VehicleFormValues } from '../types/vehicle';
import { useVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from '../services/vehicleService';
import VehicleForm from './VehicleForm';
import ConfirmDialog from './ConfirmDialog';

export default function VehicleTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [formOpen, setFormOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    const { data, isLoading } = useVehicles(page + 1, rowsPerPage);
    const createVehicle = useCreateVehicle();
    const updateVehicle = useUpdateVehicle();
    const deleteVehicle = useDeleteVehicle();

    const handleCreateSubmit = async (values: VehicleFormValues) => {
        try {
            await createVehicle.mutateAsync(values);
            setFormOpen(false);
        } catch (error) {
            console.error('Failed to create vehicle:', error);
            // Error handling is managed by React Query
        }
    };

    const handleUpdateSubmit = async (values: VehicleFormValues) => {
        if (!selectedVehicle) return;
        try {
            await updateVehicle.mutateAsync({ id: selectedVehicle.id, values });
            setFormOpen(false);
            setSelectedVehicle(null);
        } catch (error) {
            console.error('Failed to update vehicle:', error);
            // Error handling is managed by React Query
        }
    };

    const handleEdit = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setFormOpen(true);
    };

    const handleDelete = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedVehicle) return;
        try {
            await deleteVehicle.mutateAsync(selectedVehicle.id);
            setConfirmOpen(false);
            setSelectedVehicle(null);
        } catch (error) {
            console.error('Failed to delete vehicle:', error);
            // Error handling is managed by React Query
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const isSubmitting = createVehicle.isPending || updateVehicle.isPending || deleteVehicle.isPending;

    return (
        <Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Vehicles</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setSelectedVehicle(null);
                        setFormOpen(true);
                    }}
                    disabled={isSubmitting}
                >
                    New Vehicle
                </Button>
            </Box>

            {isLoading ?
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography>Loading vehicles...</Typography>
                </Box>
                : data?.vehicles.length === 0 ?
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography>No vehicles found</Typography>
                    </Box>
                    : <> </>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>License Plate</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.vehicles.map((vehicle) => (
                            <TableRow key={vehicle.id}>
                                <TableCell>{vehicle.licensePlate}</TableCell>
                                <TableCell>{vehicle.type}</TableCell>
                                <TableCell>{vehicle.status}</TableCell>
                                <TableCell>{new Date(vehicle.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(vehicle)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(vehicle)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={data?.total || 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10]}
            />

            <VehicleForm
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                }}
                onSubmit={selectedVehicle ? handleUpdateSubmit : handleCreateSubmit}
                initialData={selectedVehicle ? {
                    licensePlate: selectedVehicle.licensePlate,
                    type: selectedVehicle.type,
                    status: selectedVehicle.status,
                } : undefined}
            />

            <ConfirmDialog
                open={confirmOpen}
                title={`Delete Vehicle ${selectedVehicle?.licensePlate}`}
                onClose={() => {
                    setConfirmOpen(false);
                    setSelectedVehicle(null);
                }}
                onConfirm={handleConfirmDelete}
            />
        </Box>
    );
}
