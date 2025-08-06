import { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

interface ItemFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  initialData?: Item;
}

export interface Item {
  id?: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'completed', label: 'Completed' },
];

export default function ItemForm({ open, onClose, onSubmit, initialData }: ItemFormProps) {
  const [item, setItem] = useState<Item>({
    title: '',
    description: '',
    status: 'draft',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setItem(initialData);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!item.title) newErrors.title = 'Title is required';
    if (item.title && item.title.length > 100) newErrors.title = 'Title must be less than 100 characters';
    if (item.description && item.description.length > 1000) newErrors.description = 'Description must be less than 1000 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;
    try {
      if (initialData?.id) {
        await axios.put(`${apiBaseUrl}/api/items/${initialData.id}`, item);
      } else {
        await axios.post(`${apiBaseUrl}/api/items`, item);
      }
      onSubmit();
      onClose();
    } catch (error: any) {
      if (error.response?.data?.details) {
        setErrors(error.response.data.details);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Item' : 'Create New Item'}</DialogTitle>
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Title"
            value={item.title}
            onChange={(e) => setItem({ ...item, title: e.target.value })}
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={item.description || ''}
            onChange={(e) => setItem({ ...item, description: e.target.value })}
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            select
            label="Status"
            value={item.status}
            onChange={(e) => setItem({ ...item, status: e.target.value as Item['status'] })}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
