import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getProducts } from '../features/products/productSlice';
import { useNavigate } from 'react-router-dom';
import { createSale } from '../features/sales/salesSlice';
import { toast } from 'react-toastify';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
  Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DataTable from '../components/common/DataTable';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.products);
  
  // Responsive design hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estado para el diálogo de venta
  const [openSaleDialog, setOpenSaleDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const getStockColor = (stock, type) => {
    if (type === 'class') return 'success'; // Las clases siempre tienen stock
    if (!stock) return 'error';
    const totalStock = Object.values(stock).reduce((a, b) => a + b, 0);
    if (totalStock === 0) return 'error';
    if (totalStock < 5) return 'warning';
    return 'success';
  };

  const columns = [
    { 
      field: 'name', 
      headerName: 'Nombre', 
      flex: 1,
      minWidth: 150
    },
    { 
      field: 'type', 
      headerName: 'Tipo', 
      width: 120,
      valueFormatter: (params) => {
        const types = {
          consumable: 'Consumible',
          equipment: 'Equipo',
          clothing: 'Ropa'
        };
        return types[params.value] || params.value;
      }
    },
    { 
      field: 'price', 
      headerName: 'Precio', 
      width: 120,
      valueFormatter: (params) => {
        return params.value ? `$${Number(params.value).toFixed(2)}` : '$0.00';
      }
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 100,
      renderCell: (params) => {
        if (params.row.type === 'class') {
          return (
            <Chip
              label="N/A"
              color="success"
              size="small"
            />
          );
        }
        const stock = params.value || {};
        const totalStock = Object.values(stock).reduce((a, b) => a + b, 0);
        return (
          <Chip
            label={totalStock}
            color={getStockColor(stock, params.row.type)}
            size="small"
          />
        );
      },
    },
  ];

  const handleAddToCart = (product) => {
    // Si es una clase, no necesitamos verificar stock
    if (product.type === 'class') {
      setSelectedProduct(product);
      setSelectedLocation('Villas del Parque'); // Ubicación por defecto para clases
      setQuantity(1);
      setOpenSaleDialog(true);
      return;
    }
    
    // Para otros productos, encontrar ubicaciones con stock disponible
    const stockEntries = Object.entries(product.stock || {});
    const availableLocations = stockEntries.filter(([_, qty]) => qty > 0);
    
    if (availableLocations.length === 0) {
      toast.error('No hay stock disponible');
      return;
    }
    
    // Abrir el diálogo de venta
    setSelectedProduct(product);
    setSelectedLocation(availableLocations[0][0]); // Seleccionar la primera ubicación por defecto
    setQuantity(1);
    setOpenSaleDialog(true);
  };
  
  const handleCloseSaleDialog = () => {
    setOpenSaleDialog(false);
    setSelectedProduct(null);
    setQuantity(1);
    setSelectedLocation('');
  };
  
  const handleSale = async () => {
    try {
      if (!selectedProduct || !selectedLocation || quantity <= 0) {
        toast.error('Por favor, complete todos los campos correctamente');
        return;
      }
      
      // Verificar que hay suficiente stock (solo para productos que no son clases)
      if (selectedProduct.type !== 'class') {
        const availableStock = selectedProduct.stock[selectedLocation] || 0;
        if (quantity > availableStock) {
          toast.error(`Solo hay ${availableStock} unidades disponibles en esta ubicación`);
          return;
        }
      }
      
      const saleData = {
        productId: selectedProduct._id,
        quantity: quantity,
        location: selectedLocation
      };
      
      const result = await dispatch(createSale(saleData)).unwrap();
      if (result) {
        toast.success('Venta realizada con éxito');
        dispatch(getProducts());
        handleCloseSaleDialog();
      }
    } catch (error) {
      console.error('Error al procesar venta:', error);
      toast.error(error?.response?.data?.message || 'Error al procesar la venta');
    }
  };

  const calculateInventoryValue = () => {
    return products.reduce((total, product) => {
      if (!product.stock || !product.price) return total;
      const stockTotal = Object.values(product.stock).reduce((a, b) => a + b, 0);
      return total + (stockTotal * product.price);
    }, 0);
  };

  const getProductsWithoutStock = () => {
    return products.filter(product => {
      if (!product.stock) return true;
      return Object.values(product.stock).reduce((a, b) => a + b, 0) === 0;
    }).length;
  };

  return (
    <Container maxWidth={isMobile ? "sm" : "lg"} sx={{ mt: isMobile ? 2 : 4, mb: 4, px: isMobile ? 1 : 3 }}>
      {/* Diálogo de venta */}
      <Dialog 
        open={openSaleDialog} 
        onClose={handleCloseSaleDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            m: isMobile ? 2 : 3,
            maxHeight: isMobile ? '90vh' : 'auto'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          Realizar venta
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {selectedProduct && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 1 }}>
                {selectedProduct.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                Precio: ${selectedProduct.price?.toFixed(2)}
              </Typography>
              
              {selectedProduct.type !== 'class' ? (
                <FormControl fullWidth sx={{ mb: 2 }} size={isMobile ? "small" : "medium"}>
                  <InputLabel id="location-select-label">Ubicación</InputLabel>
                  <Select
                    labelId="location-select-label"
                    value={selectedLocation}
                    label="Ubicación"
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    {Object.entries(selectedProduct.stock || {}).map(([location, qty]) => (
                      <MenuItem 
                        key={location} 
                        value={location}
                        disabled={qty <= 0}
                      >
                        {location} ({qty} disponibles)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <FormControl fullWidth sx={{ mb: 2 }} size={isMobile ? "small" : "medium"}>
                  <InputLabel id="location-select-label">Ubicación</InputLabel>
                  <Select
                    labelId="location-select-label"
                    value={selectedLocation}
                    label="Ubicación"
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <MenuItem value="Villas del Parque">Villas del Parque</MenuItem>
                    <MenuItem value="UAN">UAN</MenuItem>
                  </Select>
                </FormControl>
              )}
              
              <TextField
                label="Cantidad"
                type="number"
                fullWidth
                size={isMobile ? "small" : "medium"}
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setQuantity('');
                  } else {
                    const numValue = parseInt(value);
                    if (!isNaN(numValue)) {
                      setQuantity(numValue);
                    }
                  }
                }}
                onBlur={() => {
                  if (quantity === '' || quantity < 1) {
                    setQuantity(1);
                  }
                }}
                InputProps={{ 
                  inputProps: { 
                    min: 1, 
                    max: selectedProduct.type === 'class' ? 999 : (selectedProduct.stock?.[selectedLocation] || 1) 
                  } 
                }}
                helperText={selectedProduct.type === 'class' ? 'Sin límite de cantidad' : `Máximo disponible: ${selectedProduct.stock?.[selectedLocation] || 0}`}
              />
              
              <Typography variant="h6" sx={{ mt: 3, textAlign: 'center', fontWeight: 'bold', color: '#d4af37' }}>
                Total: ${(selectedProduct.price * quantity).toFixed(2)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          p: isMobile ? 2 : 3,
          gap: 1,
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Button 
            onClick={handleCloseSaleDialog} 
            fullWidth={isMobile}
            size={isMobile ? "medium" : "large"}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSale} 
            variant="contained" 
            color="primary"
            fullWidth={isMobile}
            size={isMobile ? "medium" : "large"}
          >
            Confirmar venta
          </Button>
        </DialogActions>
      </Dialog>
      
      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Resumen de Productos */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            p: isMobile ? 2 : 3,
            background: 'linear-gradient(135deg, #000000 0%, #1f2937 100%)',
            color: '#d4af37',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            border: '2px solid #d4af37',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(212, 175, 55, 0.1) 0%, transparent 100%)',
              pointerEvents: 'none',
            }
          }}>
            <CardContent sx={{ p: 0, position: 'relative', zIndex: 1 }}>
              <Typography variant="h6" component="div" sx={{ 
                mb: 1, 
                opacity: 0.9,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}>
                Total de Productos
              </Typography>
              <Typography variant={isMobile ? "h4" : "h3"} component="div" sx={{ 
                fontWeight: 900,
                textShadow: '2px 2px 4px rgba(212, 175, 55, 0.3)'
              }}>
                {products.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Productos sin Stock */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            p: isMobile ? 2 : 3,
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(220, 38, 38, 0.4)',
            border: '2px solid #dc2626',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
              pointerEvents: 'none',
            }
          }}>
            <CardContent sx={{ p: 0, position: 'relative', zIndex: 1 }}>
              <Typography variant="h6" component="div" sx={{ 
                mb: 1, 
                opacity: 0.9,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}>
                Productos sin Stock
              </Typography>
              <Typography variant={isMobile ? "h4" : "h3"} component="div" sx={{ 
                fontWeight: 900,
                textShadow: '2px 2px 4px rgba(255, 255, 255, 0.3)'
              }}>
                {getProductsWithoutStock()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Valor del Inventario */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            p: isMobile ? 2 : 3,
            background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
            color: '#ffffff',
            boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
            border: '2px solid #d4af37',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0%, transparent 100%)',
              pointerEvents: 'none',
            }
          }}>
            <CardContent sx={{ p: 0, position: 'relative', zIndex: 1 }}>
              <Typography variant="h6" component="div" sx={{ 
                mb: 1, 
                opacity: 0.9,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}>
                Valor del Inventario
              </Typography>
              <Typography variant={isMobile ? "h5" : "h4"} component="div" sx={{ 
                fontWeight: 900,
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
                ${calculateInventoryValue().toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Lista de Productos */}
        <Grid item xs={12}>
          <Paper sx={{ p: isMobile ? 2 : 3, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" gutterBottom sx={{ 
              mb: 3, 
              fontWeight: 'bold',
              color: '#d4af37',
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              Productos Disponibles
            </Typography>
            
            {isMobile ? (
              // Vista de tarjetas para móviles
              <Box>
                {products.map((product) => (
                  <Card 
                    key={product._id} 
                    sx={{ 
                      mb: 2, 
                      border: '1px solid rgba(0,0,0,0.12)',
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
                    <Box sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: '#d4af37',
                            flex: 1,
                            mr: 1,
                            fontSize: '1rem'
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Chip
                          label={product.type === 'class' ? 'Clase' : 
                                product.type === 'consumable' ? 'Consumible' : 
                                product.type === 'equipment' ? 'Equipo' : 'Ropa'}
                          size="small"
                          color="primary"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                      
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                              PRECIO
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#059669' }}>
                              ${product.price?.toFixed(2)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                              STOCK
                            </Typography>
                            {product.type === 'class' ? (
                              <Chip label="N/A" color="success" size="small" sx={{ fontSize: '0.7rem' }} />
                            ) : (
                              <Chip
                                label={Object.values(product.stock || {}).reduce((a, b) => a + b, 0)}
                                color={getStockColor(product.stock, product.type)}
                                size="small"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        startIcon={<AddShoppingCartIcon />}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.type !== 'class' && (!product.stock || Object.values(product.stock).reduce((a, b) => a + b, 0) === 0)}
                        sx={{ 
                          borderRadius: '8px',
                          py: 1,
                          fontWeight: 'bold',
                          boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)'
                        }}
                      >
                        Vender
                      </Button>
                    </Box>
                  </Card>
                ))}
              </Box>
            ) : (
              // Vista de tabla para desktop
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={products}
                  columns={[
                    ...columns,
                    {
                      field: 'actions',
                      headerName: 'Acciones',
                      width: 120,
                      renderCell: (params) => (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<AddShoppingCartIcon />}
                          onClick={() => handleAddToCart(params.row)}
                          disabled={params.row.type !== 'class' && (!params.row.stock || Object.values(params.row.stock).reduce((a, b) => a + b, 0) === 0)}
                        >
                          Vender
                        </Button>
                      ),
                    }
                  ]}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 25]}
                  getRowId={(row) => row._id}
                  disableSelectionOnClick
                />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
