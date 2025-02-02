// redux/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser } from '../actions/authActions';

interface User {
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  authenticated: boolean;
}

const initialState: AuthState = {
  user:null ,
  loading: false,
  error: null,
  authenticated: false // Check if user is in localStorage initially
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.authenticated = false;
      state.error = null;
      localStorage.removeItem('user'); // Clear the user from localStorage
    },
    setToken: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.token = action.payload;
      }
    },
    setAuthFalse: (state) => {
      state.authenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.authenticated = true;
        console.log(action.payload)
        localStorage.setItem('user', JSON.stringify(action.payload.token)); // Persist user to localStorage
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error occurred';
      });
  },
});

export const { logout, setToken,setAuthFalse } = authSlice.actions;
export default authSlice.reducer;
