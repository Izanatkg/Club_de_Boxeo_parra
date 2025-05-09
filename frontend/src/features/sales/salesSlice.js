import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get sales
export const getSales = createAsyncThunk(
  'sales/getSales',
  async (_, thunkAPI) => {
    try {
      // Obtener el estado de autenticación
      const state = thunkAPI.getState();
      const token = state.auth.user?.token;
      
      // Configurar las cabeceras con el token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      console.log('Obteniendo ventas con token:', token ? 'Sí' : 'No');
      const response = await axios.get('/api/sales', config);
      return response.data;
    } catch (error) {
      console.error('Error al obtener ventas:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Create sale
export const createSale = createAsyncThunk(
  'sales/createSale',
  async (saleData, thunkAPI) => {
    try {
      // Obtener el estado de autenticación
      const state = thunkAPI.getState();
      const token = state.auth.user?.token;
      
      // Configurar las cabeceras con el token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      console.log('Creando venta con token:', token ? 'Sí' : 'No');
      console.log('Datos de venta:', saleData);
      const response = await axios.post('/api/sales', saleData, config);
      return response.data;
    } catch (error) {
      console.error('Error al crear venta:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  sales: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  cart: [],
};

export const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cart.find(item => item.product._id === action.payload._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({
          product: action.payload,
          quantity: 1
        });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.product._id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find(item => item.product._id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSales.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSales.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sales = action.payload;
      })
      .addCase(getSales.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createSale.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sales.unshift(action.payload);
      })
      .addCase(createSale.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, reset } = salesSlice.actions;
export default salesSlice.reducer;
