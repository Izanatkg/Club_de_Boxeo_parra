import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
  Button,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';

function DataTable({ rows = [], columns, loading, onDelete, onEdit, getRowClassName, sx = {} }) {
  // Asegurarse de que rows sea siempre un array
  const safeRows = Array.isArray(rows) ? rows : [];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { user } = useSelector((state) => state.auth);
  
  // Usar Media Queries para detectar dispositivos móviles
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!safeRows.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
        }}
      >
        <Typography variant="body1" color="textSecondary">
          No hay datos para mostrar
        </Typography>
      </Box>
    );
  }

  // Renderizar vista de tarjetas para móviles o tabla para escritorio
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', ...sx }}>
      {isMobile ? (
        // Vista de tarjetas para dispositivos móviles
        <Box sx={{ p: 2 }}>
          {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => {
              return (
                <Card 
                  key={row._id} 
                  sx={{ 
                    mb: 3, 
                    border: getRowClassName && getRowClassName(row) ? '2px solid #f50057' : 'none',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.12)',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  <Box 
                    sx={{ 
                      backgroundColor: '#f8f8f8', 
                      borderBottom: '1px solid rgba(0,0,0,0.08)',
                      p: 2
                    }}
                  >
                    {/* Mostrar el nombre o primera columna como título */}
                    {columns.filter(col => !col.hide)[0] && (
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: '#1976d2' 
                        }}
                      >
                        {(() => {
                          const firstColumn = columns.filter(col => !col.hide)[0];
                          return firstColumn.valueGetter
                            ? firstColumn.valueGetter({ row })
                            : firstColumn.valueFormatter
                            ? firstColumn.valueFormatter({ value: row[firstColumn.field] })
                            : row[firstColumn.field];
                        })()}
                      </Typography>
                    )}
                  </Box>
                  
                  <CardContent sx={{ p: 2.5 }}>
                    <Grid container spacing={2}>
                      {columns
                        .filter(column => !column.hide)
                        .slice(1, 4) // Mostrar solo las siguientes 3 columnas más importantes
                        .map((column) => {
                          const value = column.valueGetter
                            ? column.valueGetter({ row })
                            : column.valueFormatter
                            ? column.valueFormatter({ value: row[column.field] })
                            : row[column.field];
                          
                          return (
                            <Grid item xs={12} key={column.field}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                                  {column.headerName}:
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                  {value}
                                </Typography>
                              </Box>
                            </Grid>
                          );
                        })}
                    </Grid>
                    
                    {columns.length > 4 && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Grid container spacing={2}>
                          {columns
                            .filter(column => !column.hide)
                            .slice(4) // Mostrar el resto de columnas debajo
                            .map((column) => {
                              const value = column.valueGetter
                                ? column.valueGetter({ row })
                                : column.valueFormatter
                                ? column.valueFormatter({ value: row[column.field] })
                                : row[column.field];
                              
                              return (
                                <Grid item xs={6} key={column.field}>
                                  <Box sx={{ display: 'flex', flexDirection: 'column', mb: 1.5 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                                      {column.headerName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                      {value}
                                    </Typography>
                                  </Box>
                                </Grid>
                              );
                            })}
                        </Grid>
                      </>
                    )}
                    
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      {onEdit && !(window.location.pathname === '/students' && user.role === 'empleado') && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => onEdit(row)}
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ 
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)'
                          }}
                        >
                          Editar
                        </Button>
                      )}
                      {onDelete && (user.role === 'admin' || (window.location.pathname === '/sales' && user.role === 'empleado')) && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => onDelete(row)}
                          size="small"
                          startIcon={<DeleteIcon />}
                          sx={{ 
                            borderRadius: '8px'
                          }}
                        >
                          Eliminar
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
        </Box>
      ) : (
        // Vista de tabla para escritorio
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow>
                {columns.map((column) =>
                  column.hide ? null : (
                    <TableCell
                      key={column.field}
                      style={{ 
                        minWidth: column.minWidth,
                        padding: '16px 20px',
                        fontSize: '0.95rem',
                        fontWeight: 'bold',
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      {column.headerName}
                    </TableCell>
                  )
                )}
                <TableCell 
                  style={{ 
                    padding: '16px 20px',
                    fontSize: '0.95rem',
                    fontWeight: 'bold',
                    backgroundColor: '#f5f5f5',
                    width: '120px',
                    textAlign: 'center'
                  }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow 
                      hover 
                      role="checkbox" 
                      tabIndex={-1} 
                      key={row._id}
                      className={getRowClassName ? getRowClassName(row) : ''}
                      sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                    >
                      {columns.map((column) =>
                        column.hide ? null : (
                          <TableCell 
                            key={column.field}
                            sx={{ 
                              padding: '14px 20px',
                              fontSize: '0.9rem',
                              borderBottom: '1px solid rgba(224, 224, 224, 0.5)'
                            }}
                          >
                            {column.valueGetter
                              ? column.valueGetter({ row })
                              : column.valueFormatter
                              ? column.valueFormatter({ value: row[column.field] })
                              : row[column.field]}
                          </TableCell>
                        )
                      )}
                      <TableCell 
                        sx={{ 
                          padding: '10px 16px',
                          textAlign: 'center',
                          borderBottom: '1px solid rgba(224, 224, 224, 0.5)'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          {onEdit && !(window.location.pathname === '/students' && user.role === 'empleado') && (
                            <IconButton
                              color="primary"
                              onClick={() => onEdit(row)}
                              size="small"
                              sx={{ 
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.15)' }
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                          {onDelete && (user.role === 'admin' || (window.location.pathname === '/sales' && user.role === 'empleado')) && (
                            <IconButton
                              color="error"
                              onClick={() => onDelete(row)}
                              size="small"
                              sx={{ 
                                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.15)' }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        sx={{
          '.MuiTablePagination-toolbar': {
            padding: '16px',
            borderTop: '1px solid rgba(224, 224, 224, 0.7)',
            backgroundColor: '#fafafa',
          },
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontWeight: 'medium',
            fontSize: '0.9rem',
          },
          '.MuiTablePagination-select': {
            marginLeft: '8px',
            marginRight: '16px',
          },
          '.MuiTablePagination-actions': {
            marginLeft: '16px',
          },
          '.MuiButtonBase-root': {
            padding: '8px',
          }
        }}
      />
    </Paper>
  );
}

export default DataTable;
