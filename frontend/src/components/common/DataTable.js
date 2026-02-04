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
        // Vista de tarjetas mejorada para dispositivos móviles
        <Box sx={{ p: 1 }}>
          {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => {
              return (
                <Card 
                  key={row._id} 
                  sx={{ 
                    mb: 2, 
                    border: getRowClassName && getRowClassName(row) ? '2px solid #f50057' : '1px solid rgba(0,0,0,0.12)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  {/* Header con información principal */}
                  <Box 
                    sx={{ 
                      background: 'linear-gradient(135deg, #000000 0%, #1f2937 100%)', 
                      color: '#d4af37',
                      p: 2,
                      position: 'relative',
                      borderBottom: '2px solid #d4af37'
                    }}
                  >
                    {/* Mostrar el nombre o primera columna como título */}
                    {columns.filter(col => !col.hide)[0] && (
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            mb: 0.5,
                            lineHeight: 1.2,
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            color: '#d4af37'
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
                        
                        {/* Segunda columna importante */}
                        {columns.filter(col => !col.hide)[1] && (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              opacity: 0.9,
                              fontSize: '0.9rem',
                              color: '#ffffff'
                            }}
                          >
                            {(() => {
                              const secondColumn = columns.filter(col => !col.hide)[1];
                              return secondColumn.valueGetter
                                ? secondColumn.valueGetter({ row })
                                : secondColumn.valueFormatter
                                ? secondColumn.valueFormatter({ value: row[secondColumn.field] })
                                : row[secondColumn.field];
                            })()}
                          </Typography>
                        )}
                      </Box>
                    )}
                    
                    {/* Indicador de estado */}
                    {row.status && (
                      <Chip
                        label={row.status === 'active' ? 'Activo' : 'Inactivo'}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: row.status === 'active' ? '#059669' : '#dc2626',
                          color: '#ffffff',
                          fontSize: '0.7rem',
                          height: '24px',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                  </Box>
                  
                  {/* Contenido con información detallada */}
                  <CardContent sx={{ p: 2 }}>
                    <Grid container spacing={1.5}>
                      {columns
                        .filter(column => !column.hide)
                        .slice(2, 6) // Mostrar las siguientes 4 columnas importantes
                        .map((column) => {
                          const value = column.valueGetter
                            ? column.valueGetter({ row })
                            : column.valueFormatter
                            ? column.valueFormatter({ value: row[column.field] })
                            : row[column.field];
                          
                          return (
                            <Grid item xs={6} key={column.field}>
                              <Box sx={{ mb: 1 }}>
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary" 
                                  sx={{ 
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                    display: 'block',
                                    mb: 0.3
                                  }}
                                >
                                  {column.headerName}
                                </Typography>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontWeight: 'medium',
                                    fontSize: '0.85rem',
                                    color: '#ffffff',
                                    lineHeight: 1.3
                                  }}
                                >
                                  {value || '-'}
                                </Typography>
                              </Box>
                            </Grid>
                          );
                        })}
                    </Grid>
                    
                    {/* Acciones */}
                    <Box sx={{ 
                      mt: 2, 
                      pt: 2, 
                      borderTop: '1px solid rgba(0,0,0,0.08)',
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      gap: 1 
                    }}>
                      {onEdit && !(window.location.pathname === '/students' && user.role === 'empleado') && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => onEdit(row)}
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ 
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
                            fontSize: '0.8rem',
                            flex: 1,
                            py: 0.8
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
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            flex: 1,
                            py: 0.8,
                            borderColor: '#dc2626',
                            color: '#dc2626',
                            '&:hover': {
                              borderColor: '#991b1b',
                              backgroundColor: 'rgba(220, 38, 38, 0.04)'
                            }
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
                        backgroundColor: '#1a1a1a'
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
        rowsPerPageOptions={isMobile ? [5, 10, 25] : [10, 25, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={isMobile ? "Filas:" : "Filas por página"}
        labelDisplayedRows={({ from, to, count }) =>
          isMobile 
            ? `${from}-${to} de ${count !== -1 ? count : `+${to}`}`
            : `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
        }
        sx={{
          '.MuiTablePagination-toolbar': {
            padding: isMobile ? '8px 12px' : '16px',
            borderTop: '1px solid rgba(224, 224, 224, 0.7)',
            backgroundColor: '#1a1a1a',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          },
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontWeight: 'medium',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
          },
          '.MuiTablePagination-select': {
            marginLeft: '8px',
            marginRight: '16px',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
          },
          '.MuiTablePagination-actions': {
            marginLeft: '16px',
          },
          '.MuiButtonBase-root': {
            padding: isMobile ? '6px' : '8px',
            margin: isMobile ? '0 2px' : '0 4px',
          },
          '@media (min-width: 600px)': {
            '.MuiTablePagination-toolbar': {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          },
        }}
      />
    </Paper>
  );
}

export default DataTable;
