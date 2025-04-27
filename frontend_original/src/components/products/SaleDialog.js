import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/sales/salesSlice';
import { toast } from 'react-toastify';

function SaleDialog({ open, onClose, product }) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setQuantity(value);
  };

  const handleSubmit = () => {
    if (quantity <= 0) {
      toast.error('La cantidad debe ser mayor a 0');
      return;
    }

    const totalStock = (product.stock?.UAN || 0) + (product.stock?.['Villas del Parque'] || 0);
    if (quantity > totalStock) {
      toast.error('No hay suficiente stock disponible');
      return;
    }

    // Agregar al carrito con la cantidad especificada
    dispatch(addToCart({ ...product, saleQuantity: quantity }));
    toast.success(`${quantity} ${product.name}(s) agregado(s) al carrito`);
    setQuantity(1);
    onClose();
  };

  if (!product) return null;

  const totalStock = (product.stock?.UAN || 0) + (product.stock?.['Villas del Parque'] || 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Vender {product.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Stock disponible: {totalStock} unidades
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Cantidad"
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          InputProps={{ inputProps: { min: 1, max: totalStock } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Agregar al carrito
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SaleDialog;
