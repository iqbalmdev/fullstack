// src/redux/authenticateUser.ts

import {  createAsyncThunk } from '@reduxjs/toolkit';
// import {  } from '../store'; // Ensure your store is correctly set up
import { login } from '../../utils/api/auth';
import { AxiosError } from 'axios'; // Import AxiosError if using Axios

// Define the shape of the response data
// interface UserData {
//   token: string;
//   user: {
//     id: string;
//     name: string;
//     email: string;
//   };
// }

// Define the shape of the credentials
// interface Credentials {
//   email: string;
//   password: string;
// }

// // Define the shape of possible errors
// interface AuthError {
//   message: string;
// }
interface User {
  email: string;
  token: string;
}



// Initial state


// Authenticate user function

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string; callback: (response?: User) => void },
  { rejectValue: string }
>(
  "auth/login",
  async ({ email, password, callback }, { rejectWithValue }) => {
    try {
      const response = await login(email, password);
      callback(response); // Call the callback function after successful login
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Authentication failed";
      callback(); // Ensure callback is still called to reset loading state
      return rejectWithValue(errorMessage);
    }
  }
);


