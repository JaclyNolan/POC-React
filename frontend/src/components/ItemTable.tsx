import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TablePagination,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { Item } from './ItemForm';
import ItemForm from './ItemForm';
import ConfirmDialog from './ConfirmDialog';

export default function ItemTable() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [rowsPerPage] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchItems = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;
      const res = await axios.get(`${apiBaseUrl}/api/items?page=${page + 1}&limit=${rowsPerPage}`);
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: Item) => {
    setSelectedItem(item);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem?.id) return;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;
      await axios.delete(`${apiBaseUrl}/api/items/${selectedItem.id}`);
      fetchItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
    setConfirmOpen(false);
    setSelectedItem(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchItems();
  }, [page, rowsPerPage]);

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Items</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedItem(null);
            setFormOpen(true);
          }}
        >
          New Item
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{new Date(item.createdAt!).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(item)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item)} color="error">
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
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
      />

      <ItemForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={fetchItems}
        initialData={selectedItem || undefined}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={selectedItem?.title || ''}
        onClose={() => {
          setConfirmOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
