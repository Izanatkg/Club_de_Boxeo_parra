import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getSales, updateSale, deleteSale } from '../features/sales/salesSlice';
import { getUsers } from '../features/users/userSlice';
import { exportToExcel, formatDate, formatCurrency } from '../utils/excelExport';
import Layout from '../components/common/Layout';

function Sales() {
  const dispatch = useDispatch();
  const { sales, isLoading } = useSelector((state) => state.sales);
  const { users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);
  
  // Estados para manejar el diálogo de edición y eliminación
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [editFormData, setEditFormData] = useState({
    quantity: '',
    total: '',
    notes: ''
  });
  
  // Función para exportar a Excel
  const handleExportToExcel = () => {
    // Preparar datos para exportación
    const dataToExport = sales.map(sale => {
      // Calcular el precio unitario si no está disponible directamente
      const unitPrice = sale.unitPrice || (sale.total && sale.quantity ? sale.total / sale.quantity : sale.product?.price || 0);
      
      // Obtener el nombre del vendedor, ya sea desde el objeto populado o buscándolo en la lista de usuarios
      let vendedorName = '';
      if (sale.createdBy && typeof sale.createdBy === 'object' && sale.createdBy.name) {
        vendedorName = sale.createdBy.name;
      } else {
        const vendedor = users.find(user => user._id === sale.createdBy);
        vendedorName = vendedor ? vendedor.name : '';
      }
      
      return {
        ...sale,
        // Asegurarnos de que el nombre del producto esté disponible
        name: sale.product?.name || sale.productName || 'Producto sin nombre',
        // Asegurarnos de que el precio unitario esté disponible
        unitPrice: unitPrice,
        // Agregar el nombre del vendedor
        vendedor: vendedorName
      };
    });
    
    // Configurar columnas
    const columns = [
      { header: 'Fecha', key: 'date', width: 20, formatter: (value) => formatDate(value) },
      { header: 'Producto', key: 'name', width: 30 },
      { header: 'Cantidad', key: 'quantity', width: 10 },
      { header: 'Precio Unitario', key: 'unitPrice', width: 15, formatter: (value) => formatCurrency(value) },
      { header: 'Total', key: 'total', width: 15, formatter: (value) => formatCurrency(value) },
      { header: 'Ubicación', key: 'location', width: 15 },
      { header: 'Vendedor', key: 'vendedor', width: 20 },
    ];
    
    // Exportar datos
    const result = exportToExcel(dataToExport, columns, 'Reporte_Ventas_' + new Date().toISOString().split('T')[0], 'Ventas');
    
    if (result) {
      toast.success('Reporte exportado con éxito');
    } else {
      toast.error('Error al exportar el reporte');
    }
  };
  
  // Funciones para manejar la edición de ventas
  const handleOpenEditDialog = (sale) => {
    // Calcular el precio unitario
    const unitPrice = sale.unitPrice || (sale.total && sale.quantity ? sale.total / sale.quantity : sale.product?.price || 0);
    
    setSelectedSale({
      ...sale,
      unitPrice: unitPrice // Guardar el precio unitario para usarlo en cálculos posteriores
    });
    
    setEditFormData({
      quantity: sale.quantity,
      total: sale.total,
      notes: sale.notes || ''
    });
    
    setOpenEditDialog(true);
  };
  
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedSale(null);
  };
  
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'quantity' && selectedSale) {
      // Actualizar automáticamente el total basado en la cantidad
      const newQuantity = parseFloat(value) || 0;
      const newTotal = newQuantity * selectedSale.unitPrice;
      
      setEditFormData({
        ...editFormData,
        quantity: value,
        total: newTotal.toFixed(2)
      });
    } else if (name === 'total') {
      // Si se modifica el total manualmente, actualizar sin cambiar otros campos
      setEditFormData({
        ...editFormData,
        [name]: value
      });
    } else {
      // Para otros campos como notas
      setEditFormData({
        ...editFormData,
        [name]: value
      });
    }
  };
  
  const handleEditSave = () => {
    if (!selectedSale) return;
    
    const updatedSale = {
      ...selectedSale,
      quantity: Number(editFormData.quantity),
      total: Number(editFormData.total),
      notes: editFormData.notes
    };
    
    dispatch(updateSale(updatedSale))
      .unwrap()
      .then(() => {
        toast.success('Venta actualizada con éxito');
        setOpenEditDialog(false);
        setSelectedSale(null);
      })
      .catch((error) => {
        toast.error(`Error al actualizar la venta: ${error}`);
      });
  };
  
  // Funciones para manejar la eliminación de ventas
  const handleOpenDeleteDialog = (sale) => {
    setSelectedSale(sale);
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedSale(null);
  };
  
  const handleDeleteSale = () => {
    if (!selectedSale) return;
    
    dispatch(deleteSale(selectedSale._id))
      .unwrap()
      .then(() => {
        toast.success('Venta eliminada con éxito');
        setOpenDeleteDialog(false);
        setSelectedSale(null);
      })
      .catch((error) => {
        toast.error(`Error al eliminar la venta: ${error}`);
      });
  };

  useEffect(() => {
    dispatch(getSales());
    dispatch(getUsers());
  }, [dispatch]);

  // Calcular ventas del día
  const getDailySales = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return sales
      .filter(sale => new Date(sale.date) >= today)
      .reduce((total, sale) => total + sale.total, 0);
  };

  // Calcular ventas del mes
  const getMonthlySales = () => {
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    return sales
      .filter(sale => new Date(sale.date) >= firstDayOfMonth)
      .reduce((total, sale) => total + sale.total, 0);
  };

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                color: '#1976d2',
                fontSize: { xs: '1.8rem', sm: '2.2rem' }
              }}
            >
              Ventas
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Resumen de Ventas */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography color="textSecondary" gutterBottom variant="h6">
                Ventas del Día
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                ${getDailySales().toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography color="textSecondary" gutterBottom variant="h6">
                Ventas del Mes
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                ${getMonthlySales().toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Historial de Ventas */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Historial de Ventas
                </Typography>
                <Tooltip title="Exportar a Excel">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportToExcel}
                    sx={{ 
                      borderRadius: '8px',
                      boxShadow: '0 2px 5px rgba(25, 118, 210, 0.3)'
                    }}
                  >
                    Exportar
                  </Button>
                </Tooltip>
              </Box>
              <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: 'none', border: '1px solid rgba(0,0,0,0.08)' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Vendedor</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          Cargando ventas...
                        </TableCell>
                      </TableRow>
                    ) : sales.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          No hay ventas registradas
                        </TableCell>
                      </TableRow>
                    ) : (
                      sales.map((sale) => (
                        <TableRow key={sale._id}>
                          <TableCell>
                            {new Date(sale.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {sale.product ? sale.product.name : 'Producto eliminado'}
                          </TableCell>
                          <TableCell align="right">{sale.quantity}</TableCell>
                          <TableCell align="right">
                            ${sale.total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {sale.createdBy && typeof sale.createdBy === 'object' && sale.createdBy.name
                              ? sale.createdBy.name
                              : users.find(user => user._id === sale.createdBy)?.name || ''}
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <IconButton
                                color="primary"
                                onClick={() => handleOpenEditDialog(sale)}
                                size="small"
                                sx={{ 
                                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                  '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.15)' }
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleOpenDeleteDialog(sale)}
                                size="small"
                                sx={{ 
                                  backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                  '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.15)' }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Diálogo de Edición */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Venta</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cantidad"
                  name="quantity"
                  type="number"
                  value={editFormData.quantity}
                  onChange={handleEditInputChange}
                  variant="outlined"
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total"
                  name="total"
                  type="number"
                  value={editFormData.total}
                  onChange={handleEditInputChange}
                  variant="outlined"
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notas"
                  name="notes"
                  value={editFormData.notes}
                  onChange={handleEditInputChange}
                  variant="outlined"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseEditDialog} color="inherit">Cancelar</Button>
          <Button 
            onClick={handleEditSave} 
            variant="contained" 
            color="primary"
            sx={{ 
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(25, 118, 210, 0.3)'
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Eliminación */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar esta venta? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDeleteDialog} color="inherit">Cancelar</Button>
          <Button 
            onClick={handleDeleteSale} 
            variant="contained" 
            color="error"
            sx={{ 
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(211, 47, 47, 0.3)'
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default Sales;
