import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getStudents,
  deleteStudent,
  reset,
} from '../features/students/studentSlice';
import { toast } from 'react-toastify';
import Layout from '../components/common/Layout';
import DataTable from '../components/common/DataTable';
import StudentForm from '../components/students/StudentForm';
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
  Chip,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function Students() {
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'active',
    gym: '',
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { students = [], isLoading, isError, message } = useSelector(
    (state) => state.students
  );
  
  // Responsive design hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(
      getStudents({
        ...filters,
        gym: user.role === 'admin' ? filters.gym : user.assignedGym,
      })
    );

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isError, message, filters, user]);

  const handleOpenForm = (student = null) => {
    setSelectedStudent(student);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setSelectedStudent(null);
    setOpenForm(false);
  };

  const handleDelete = (student) => {
    setSelectedStudent(student);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteStudent(selectedStudent._id));
    setOpenConfirm(false);
    setSelectedStudent(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return format(new Date(date), 'dd/MM/yyyy', { locale: es });
  };

  const getPaymentStatus = (lastPayment, nextPaymentDate) => {
    if (!nextPaymentDate) return 'Sin pagos';
    
    const today = new Date();
    const nextPayment = new Date(nextPaymentDate);
    
    if (nextPayment < today) {
      return 'Vencido';
    }
    
    const daysUntilPayment = Math.ceil((nextPayment - today) / (1000 * 60 * 60 * 24));
    if (daysUntilPayment <= 7) {
      return 'Próximo a vencer';
    }
    
    return 'Al día';
  };

  const columns = [
    { field: 'name', headerName: 'Nombre', minWidth: 200 },
    { field: 'phone', headerName: 'Teléfono', minWidth: 150 },
    {
      field: 'membershipType',
      headerName: 'Membresía',
      minWidth: 120,
      valueFormatter: ({ value }) => {
        const types = {
          monthly: 'Mensual',
          weekly: 'Semanal',
          class: 'Por Clase'
        };
        return types[value] || value;
      }
    },
    {
      field: 'lastPayment',
      headerName: 'Último Pago',
      minWidth: 120,
      valueFormatter: ({ value }) => formatDate(value)
    },
    {
      field: 'nextPaymentDate',
      headerName: 'Próximo Pago',
      minWidth: 120,
      valueFormatter: ({ value }) => formatDate(value)
    },
    {
      field: 'status',
      headerName: 'Estado',
      minWidth: 120,
      valueFormatter: ({ value }) =>
        value === 'active' ? 'Activo' : 'Inactivo',
    },
    {
      field: 'gym',
      headerName: 'Gimnasio',
      minWidth: 120,
      hide: user.role !== 'admin',
      valueFormatter: ({ value }) =>
        value === 'UAN' ? 'UAN' : 'Villas del Parque',
    },
  ];

  // Función para determinar si un estudiante está vencido
  const isExpired = (nextPaymentDate) => {
    if (!nextPaymentDate) return false;
    const today = new Date();
    const nextPayment = new Date(nextPaymentDate);
    return nextPayment < today;
  };

  return (
    <Layout>
      <Box sx={{ mb: isMobile ? 2 : 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                color: '#dc2626',
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              Estudiantes
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'center', sm: 'right' }, mt: { xs: 1, sm: 0 } }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenForm()}
              size={isMobile ? "medium" : "large"}
              fullWidth={isMobile}
              sx={{ 
                borderRadius: '8px',
                padding: isMobile ? '8px 16px' : '10px 20px',
                boxShadow: '0 4px 10px rgba(220, 38, 38, 0.3)',
                fontWeight: 'bold',
                '&:hover': {
                  boxShadow: '0 6px 12px rgba(220, 38, 38, 0.4)',
                  backgroundColor: '#991b1b'
                }
              }}
            >
              Nuevo Estudiante
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: isMobile ? 2 : 4, mt: isMobile ? 1 : 2 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: isMobile ? 2 : 3, 
            borderRadius: '12px', 
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium', color: '#ffffff', textAlign: { xs: 'center', sm: 'left' } }}>
            Filtros de búsqueda
          </Typography>
          <Grid container spacing={isMobile ? 2 : 3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Buscar por nombre"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                variant="outlined"
                size={isMobile ? "small" : "medium"}
                InputProps={{
                  sx: { 
                    borderRadius: '8px',
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(212, 175, 55, 0.3)'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth variant="outlined" size={isMobile ? "small" : "medium"}>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  label="Estado"
                  sx={{ 
                    borderRadius: '8px',
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(212, 175, 55, 0.3)'
                    }
                  }}
                >
                  <MenuItem value="active">Activo</MenuItem>
                  <MenuItem value="inactive">Inactivo</MenuItem>
                  <MenuItem value="">Todos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {user.role === 'admin' && (
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth variant="outlined" size={isMobile ? "small" : "medium"}>
                  <InputLabel>Gimnasio</InputLabel>
                  <Select
                    name="gym"
                    value={filters.gym}
                    onChange={handleFilterChange}
                    label="Gimnasio"
                    sx={{ 
                      borderRadius: '8px',
                      backgroundColor: '#1a1a1a',
                      color: '#ffffff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(212, 175, 55, 0.3)'
                      }
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="UAN">UAN</MenuItem>
                    <MenuItem value="Villas del Parque">Villas del Parque</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>

      <DataTable
        rows={students}
        columns={columns}
        loading={isLoading}
        onEdit={handleOpenForm}
        onDelete={handleDelete}
        getRowClassName={(row) => isExpired(row.nextPaymentDate) ? 'expired-row' : ''}
        sx={{
          '& .expired-row': {
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(220, 38, 38, 0.2)',
            },
          },
          '& .expired-row td': {
            color: '#dc2626',
            fontWeight: 'bold',
          },
        }}
      />

      <StudentForm
        open={openForm}
        onClose={handleCloseForm}
        student={selectedStudent}
      />

      <ConfirmDialog
        open={openConfirm}
        title="Eliminar Estudiante"
        message="¿Está seguro que desea eliminar este estudiante? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onClose={() => setOpenConfirm(false)}
      />
    </Layout>
  );
}

export default Students;
