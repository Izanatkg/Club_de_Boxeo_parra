import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPayments,
  deletePayment,
  reset,
} from '../features/payments/paymentSlice';
import { getUsers } from '../features/users/userSlice';
import { toast } from 'react-toastify';
import Layout from '../components/common/Layout';
import DataTable from '../components/common/DataTable';
import PaymentForm from '../components/payments/PaymentForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import { format } from 'date-fns';
import { exportToExcel, formatDate, formatCurrency } from '../utils/excelExport';

function Payments() {
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    paymentType: '',
    paymentMethod: '',
    gym: '',
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { payments, isLoading, isError, message } = useSelector(
    (state) => state.payments
  );
  const { users } = useSelector((state) => state.users);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(
      getPayments({
        ...filters,
        gym: user.role === 'admin' ? filters.gym : user.assignedGym,
      })
    );
    
    // Obtener la lista de usuarios para mostrar quién registró cada pago
    dispatch(getUsers());

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message, filters, user]);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleDelete = (payment) => {
    setSelectedPayment(payment);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deletePayment(selectedPayment._id));
    setOpenConfirm(false);
    setSelectedPayment(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Función para exportar a Excel
  const handleExportToExcel = () => {
    // Configurar columnas
    const columns = [
      { header: 'Estudiante', key: 'student', width: 30, formatter: (value) => value?.name || 'N/A' },
      { header: 'Monto', key: 'amount', width: 15, formatter: (value) => formatCurrency(value) },
      { header: 'Tipo de Pago', key: 'paymentType', width: 15, formatter: (value) => {
        const types = {
          monthly: 'Mensual',
          weekly: 'Semanal',
          class: 'Clase',
        };
        return types[value] || value;
      }},
      { header: 'Método de Pago', key: 'paymentMethod', width: 15, formatter: (value) => {
        const methods = {
          cash: 'Efectivo',
          card: 'Tarjeta',
          transfer: 'Transferencia',
        };
        return methods[value] || value;
      }},
      { header: 'Fecha', key: 'paymentDate', width: 20, formatter: (value) => formatDate(value) },
      { header: 'Gimnasio', key: 'gym', width: 15, formatter: (value) => value === 'uan' ? 'UAN' : 'Villas del Parque' },
      { header: 'Registrado por', key: 'processedBy', width: 25, formatter: (value) => {
        // Si el valor es un objeto (populado), usar directamente su nombre
        if (value && typeof value === 'object' && value.name) {
          return value.name;
        }
        // Si es un ID, buscar el usuario correspondiente
        const user = users.find(u => u._id === value);
        return user ? user.name : '';
      }},
      { header: 'Notas', key: 'notes', width: 40 },
    ];
    
    // Exportar datos
    const result = exportToExcel(payments, columns, 'Reporte_Pagos_' + new Date().toISOString().split('T')[0], 'Pagos');
    
    if (result) {
      toast.success('Reporte exportado con éxito');
    } else {
      toast.error('Error al exportar el reporte');
    }
  };

  const columns = [
    {
      field: 'student',
      headerName: 'Estudiante',
      minWidth: 200,
      valueGetter: ({ row }) => row.student?.name || 'N/A',
    },
    {
      field: 'processedBy',
      headerName: 'Registrado por',
      minWidth: 150,
      valueGetter: ({ row }) => {
        // Primero intentamos obtener el nombre directamente del objeto processedBy (si está populado)
        if (row.processedBy && typeof row.processedBy === 'object' && row.processedBy.name) {
          return row.processedBy.name;
        }
        
        // Si no está populado, buscamos el usuario por ID
        const processor = users.find(user => user._id === row.processedBy);
        return processor ? processor.name : '';
      },
    },
    {
      field: 'amount',
      headerName: 'Monto',
      minWidth: 120,
      valueFormatter: ({ value }) =>
        value ? `$${value.toFixed(2)}` : '$0.00',
    },
    {
      field: 'paymentType',
      headerName: 'Tipo',
      minWidth: 120,
      valueFormatter: ({ value }) => {
        const types = {
          monthly: 'Mensual',
          weekly: 'Semanal',
          class: 'Clase',
        };
        return types[value] || value;
      },
    },
    {
      field: 'paymentMethod',
      headerName: 'Método',
      minWidth: 120,
      valueFormatter: ({ value }) => {
        const methods = {
          cash: 'Efectivo',
          card: 'Tarjeta',
          transfer: 'Transferencia',
        };
        return methods[value] || value;
      },
    },
    {
      field: 'paymentDate',
      headerName: 'Fecha',
      minWidth: 120,
      valueFormatter: ({ value }) =>
        value ? format(new Date(value), 'dd/MM/yyyy') : 'N/A',
    },
    {
      field: 'gym',
      headerName: 'Gimnasio',
      minWidth: 120,
      hide: user.role !== 'admin',
      valueFormatter: ({ value }) =>
        value === 'uan' ? 'UAN' : 'Villas del Parque',
    },
  ];

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              Pagos
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Tooltip title="Exportar a Excel">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={handleExportToExcel}
              >
                Exportar
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenForm}
            >
              Nuevo Pago
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Buscar"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Pago</InputLabel>
              <Select
                name="paymentType"
                value={filters.paymentType}
                onChange={handleFilterChange}
                label="Tipo de Pago"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="monthly">Mensual</MenuItem>
                <MenuItem value="weekly">Semanal</MenuItem>
                <MenuItem value="class">Clase</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Método de Pago</InputLabel>
              <Select
                name="paymentMethod"
                value={filters.paymentMethod}
                onChange={handleFilterChange}
                label="Método de Pago"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="cash">Efectivo</MenuItem>
                <MenuItem value="card">Tarjeta</MenuItem>
                <MenuItem value="transfer">Transferencia</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {user.role === 'admin' && (
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Gimnasio</InputLabel>
                <Select
                  name="gym"
                  value={filters.gym}
                  onChange={handleFilterChange}
                  label="Gimnasio"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="uan">UAN</MenuItem>
                  <MenuItem value="villas">Villas del Parque</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Box>

      <DataTable
        rows={payments}
        columns={columns}
        loading={isLoading}
        onDelete={handleDelete}
      />

      <PaymentForm open={openForm} onClose={handleCloseForm} />

      <ConfirmDialog
        open={openConfirm}
        title="Eliminar Pago"
        message="¿Está seguro que desea eliminar este pago? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onClose={() => setOpenConfirm(false)}
      />
    </Layout>
  );
}

export default Payments;
