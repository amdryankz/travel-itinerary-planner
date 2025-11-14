import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import url from '../../constants/url'

const initialState = {
  user: {},
  status: 'idle',
  error: null
}

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (arg, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${url}/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.clear()
      state.user = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.error = action.payload;
      });
  },
})

export const { logout } = authSlice.actions;

export default authSlice.reducer