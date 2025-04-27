import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import noticeService from './noticeService';

const initialState = {
  notices: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get all notices (public)
export const getNotices = createAsyncThunk(
  'notices/getAll',
  async (_, thunkAPI) => {
    try {
      return await noticeService.getNotices();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all notices (admin)
export const getAllNotices = createAsyncThunk(
  'notices/getAllAdmin',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await noticeService.getAllNotices(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new notice
export const createNotice = createAsyncThunk(
  'notices/create',
  async (noticeData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await noticeService.createNotice(noticeData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update notice
export const updateNotice = createAsyncThunk(
  'notices/update',
  async ({ noticeId, noticeData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await noticeService.updateNotice(noticeId, noticeData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete notice
export const deleteNotice = createAsyncThunk(
  'notices/delete',
  async (noticeId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await noticeService.deleteNotice(noticeId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Toggle notice status
export const toggleNoticeStatus = createAsyncThunk(
  'notices/toggleStatus',
  async (noticeId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await noticeService.toggleNoticeStatus(noticeId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const noticeSlice = createSlice({
  name: 'notices',
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
      .addCase(getNotices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notices = action.payload;
      })
      .addCase(getNotices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllNotices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllNotices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notices = action.payload;
      })
      .addCase(getAllNotices.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createNotice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNotice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notices.push(action.payload);
      })
      .addCase(createNotice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateNotice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateNotice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notices = state.notices.map((notice) =>
          notice._id === action.payload._id ? action.payload : notice
        );
      })
      .addCase(updateNotice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteNotice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notices = state.notices.filter(
          (notice) => notice._id !== action.payload.id
        );
      })
      .addCase(deleteNotice.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(toggleNoticeStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleNoticeStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.notices = state.notices.map((notice) =>
          notice._id === action.payload._id ? action.payload : notice
        );
      })
      .addCase(toggleNoticeStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = noticeSlice.actions;
export default noticeSlice.reducer;
