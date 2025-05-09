import React, { useEffect } from 'react';
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
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { getSales } from '../features/sales/salesSlice';
import { getUsers } from '../features/users/userSlice';
import { exportToExcel, formatDate, formatCurrency } from '../utils/excelExport';

function Sales() {
  const dispatch = useDispatch();
  const { sales } = useSelector((state) => state.sales);
  const { users } = useSelector((state) => state.users);
  
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Resumen de Ventas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ventas del Día
              </Typography>
              <Typography variant="h5">
                ${getDailySales().toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ventas del Mes
              </Typography>
              <Typography variant="h5">
                ${getMonthlySales().toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Historial de Ventas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Historial de Ventas
                </Typography>
                <Tooltip title="Exportar a Excel">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportToExcel}
                  >
                    Exportar
                  </Button>
                </Tooltip>
              </Box>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Producto</TableCell>
                      <TableCell align="right">Cantidad</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Vendedor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sales.map((sale) => (
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
                          {/* Mostrar el nombre del vendedor, ya sea desde el objeto populado o buscándolo en la lista de usuarios */}
                          {sale.createdBy && typeof sale.createdBy === 'object' && sale.createdBy.name
                            ? sale.createdBy.name
                            : users.find(user => user._id === sale.createdBy)?.name || ''}
                        </TableCell>
                      </TableRow>
                    ))}
                    {sales.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No hay ventas registradas
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Sales;
