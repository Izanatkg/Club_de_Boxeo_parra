import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from './userService';

// Get all users
export const getUsers = createAsyncThunk(
  'users/getAll',
  async (_, thunkAPI) => {
    try {
      // Obtener el estado de autenticación
      const state = thunkAPI.getState();
      const token = state.auth.user?.token;
      
      return await userService.getUsers(token);
    } catch (error) {
      console.error('Error al obtener usuarios:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  users: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
