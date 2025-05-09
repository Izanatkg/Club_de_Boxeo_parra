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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.products);
  
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
      flex: 1 
    },
    { 
      field: 'type', 
      headerName: 'Tipo', 
      width: 130,
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
      width: 130,
      valueFormatter: (params) => {
        return params.value ? `$${Number(params.value).toFixed(2)}` : '$0.00';
      }
    },
    {
      field: 'stock',
      headerName: 'Stock Total',
      width: 130,
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
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 130,
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Diálogo de venta */}
      <Dialog open={openSaleDialog} onClose={handleCloseSaleDialog}>
        <DialogTitle>Realizar venta</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">{selectedProduct.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Precio: ${selectedProduct.price?.toFixed(2)}
              </Typography>
              
              {selectedProduct.type !== 'class' ? (
                <FormControl fullWidth sx={{ mb: 2 }}>
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
                <FormControl fullWidth sx={{ mb: 2 }}>
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
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                InputProps={{ inputProps: { min: 1, max: selectedProduct.stock?.[selectedLocation] || 1 } }}
                helperText={`Máximo disponible: ${selectedProduct.stock?.[selectedLocation] || 0}`}
              />
              
              <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                Total: ${(selectedProduct.price * quantity).toFixed(2)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSaleDialog}>Cancelar</Button>
          <Button onClick={handleSale} variant="contained" color="primary">
            Confirmar venta
          </Button>
        </DialogActions>
      </Dialog>
      
      <Grid container spacing={3}>
        {/* Resumen de Productos */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Productos
              </Typography>
              <Typography variant="h5">
                {products.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Productos sin Stock */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Productos sin Stock
              </Typography>
              <Typography variant="h5">
                {getProductsWithoutStock()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Valor del Inventario */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Valor del Inventario
              </Typography>
              <Typography variant="h5">
                ${calculateInventoryValue().toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Lista de Productos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Productos Disponibles
              </Typography>
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={products}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  getRowId={(row) => row._id}
                  disableSelectionOnClick
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
