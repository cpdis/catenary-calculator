import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { getCalculations, deleteCalculation, updateCalculation } from '../services/calculationService';

const CalculationHistory = ({ onSelect }) => {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialog, setEditDialog] = useState({ open: false, calculation: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, calculationId: null });
  const [editForm, setEditForm] = useState({ name: '', notes: '', tags: '' });

  const fetchCalculations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCalculations({
        page: page + 1,
        limit: rowsPerPage
      });
      setCalculations(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (calculation) => {
    setEditForm({
      name: calculation.name,
      notes: calculation.notes || '',
      tags: (calculation.tags || []).join(', ')
    });
    setEditDialog({ open: true, calculation });
  };

  const handleEditSave = async () => {
    try {
      const updatedData = {
        name: editForm.name,
        notes: editForm.notes,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await updateCalculation(editDialog.calculation._id, updatedData);
      setEditDialog({ open: false, calculation: null });
      fetchCalculations();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClick = (calculationId) => {
    setDeleteDialog({ open: true, calculationId });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCalculation(deleteDialog.calculationId);
      setDeleteDialog({ open: false, calculationId: null });
      fetchCalculations();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatSafetyStatus = (safetyFactor) => {
    if (safetyFactor >= 2.0) {
      return <Chip label="Safe" color="success" size="small" />;
    } else if (safetyFactor >= 1.5) {
      return <Chip label="Warning" color="warning" size="small" />;
    } else {
      return <Chip label="Unsafe" color="error" size="small" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Calculation History</Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchCalculations}
          size="small"
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Component</TableCell>
              <TableCell>Safety Factor</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calculations.map((calc) => (
              <TableRow
                key={calc._id}
                hover
                onClick={() => onSelect(calc)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{calc.name}</TableCell>
                <TableCell>{calc.inputs.componentType}</TableCell>
                <TableCell>
                  {formatSafetyStatus(calc.results.safetyFactor)}
                </TableCell>
                <TableCell>
                  {format(new Date(calc.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {calc.tags?.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(calc);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(calc._id);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={calculations.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, calculation: null })}>
        <DialogTitle>Edit Calculation</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Notes"
            value={editForm.notes}
            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Tags (comma-separated)"
            value={editForm.tags}
            onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
            margin="normal"
            helperText="Enter tags separated by commas"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, calculation: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSave}
            startIcon={<SaveIcon />}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, calculationId: null })}
      >
        <DialogTitle>Delete Calculation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this calculation? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, calculationId: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CalculationHistory;
