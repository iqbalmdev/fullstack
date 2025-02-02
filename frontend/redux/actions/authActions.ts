// src/redux/authenticateUser.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from '../store'; // Ensure your store is correctly set up
import { login } from '../../utils/api/auth';
import { AxiosError } from 'axios'; // Import AxiosError if using Axios

// Define the shape of the response data
interface UserData {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Define the shape of the credentials
interface Credentials {
  email: string;
  password: string;
}

// Define the shape of possible errors
interface AuthError {
  message: string;
}
interface User {
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Authenticate user function
export const loginUser = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials?.email, credentials?.password);
      return response; // Assuming response contains user data & token
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || 'Authentication failed');
    }
  }
);


