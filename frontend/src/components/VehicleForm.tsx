import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from '@mui/material';
import { VehicleFormValues } from '../types/vehicle';

const schema = z.object({
  licensePlate: z.string()
    .min(1, 'License plate is required')
    .max(20, 'License plate must be 20 characters or less')
    .trim(),
  type: z.enum(['Truck', 'Van', 'Trailer'] as const).refine((val) => ['Truck', 'Van', 'Trailer'].includes(val), {
    message: 'Please select a valid vehicle type',
  }),
  status: z.enum(['Active', 'Maintenance', 'Retired'] as const).refine((val) => ['Active', 'Maintenance', 'Retired'].includes(val), {
    message: 'Please select a valid status',
  }),
});

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: VehicleFormValues) => void;
  initialData?: VehicleFormValues;
}

export default function VehicleForm({ open, onClose, onSubmit, initialData }: Props) {
  const defaultValues: VehicleFormValues = {
    licensePlate: '',
    type: 'Truck',
    status: 'Active',
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Reset form when initialData or open changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset(defaultValues);
    }
  }, [initialData, open, reset]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{initialData ? 'Edit Vehicle' : 'New Vehicle'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              {...register('licensePlate')}
              label="License Plate"
              error={!!errors.licensePlate}
              helperText={errors.licensePlate?.message}
              fullWidth
            />

            <FormControl fullWidth error={!!errors.type}>
              <InputLabel id="type-label">Vehicle Type</InputLabel>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="type-label"
                    label="Vehicle Type"
                  >
                    <MenuItem value="Truck">Truck</MenuItem>
                    <MenuItem value="Van">Van</MenuItem>
                    <MenuItem value="Trailer">Trailer</MenuItem>
                  </Select>
                )}
              />
              {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!errors.status}>
              <InputLabel id="status-label">Status</InputLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="status-label"
                    label="Status"
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Maintenance">Maintenance</MenuItem>
                    <MenuItem value="Retired">Retired</MenuItem>
                  </Select>
                )}
              />
              {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
