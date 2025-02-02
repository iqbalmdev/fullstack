import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsersService, addUserService, deleteUserService, updateUserService, getUserService } from "../../utils/api/user";
import { User } from "../../types";
import { AxiosError } from "axios";

// Fetch all users
export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUsersService();
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch users");
    }
  }
);

// Fetch a single user by ID
export const getUser = createAsyncThunk<User, string, { rejectValue: string }>(
  "user/getUser",
  async (id: string, { rejectWithValue }) => {
    try {
      return await getUserService(id);  // Call the service function to fetch a user by ID
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || "Failed to fetch user");
    }
  }
);

// Define the addUser action with callback
export const addUser = createAsyncThunk<User, { newUser: User; callback: () => void }, { rejectValue: string }>(
  "user/addUser",
  async ({ newUser, callback }, { rejectWithValue }) => {
    try {
      const user = await addUserService(newUser);
      callback(); // Call the callback (e.g., redirect)
      return user;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || "Failed to add user");
    }
  }
);

// Define the updateUser action with callback
export const updateUser = createAsyncThunk<User, { id: string; updatedUser: Partial<User>; callback: () => void }, { rejectValue: string }>(
  "user/updateUser",
  async ({ id, updatedUser, callback }, { rejectWithValue }) => {
    try {
      const updatedUserData = await updateUserService(id, updatedUser);
      callback(); // Call the callback (e.g., redirect)
      return updatedUserData;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || "Failed to update user");
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk<string, string, { rejectValue: string }>(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await deleteUserService(id); // Call the service to delete the user
      return id; // Return the ID for state update
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || "Failed to delete user");
    }
  }
);
