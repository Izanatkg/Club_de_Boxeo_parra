import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import studentReducer from '../features/students/studentSlice';
import paymentReducer from '../features/payments/paymentSlice';
import productReducer from '../features/products/productSlice';
import salesReducer from '../features/sales/salesSlice';
import noticeReducer from '../features/notices/noticeSlice';
import userReducer from '../features/users/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    payments: paymentReducer,
    products: productReducer,
    sales: salesReducer,
    notices: noticeReducer,
    users: userReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
