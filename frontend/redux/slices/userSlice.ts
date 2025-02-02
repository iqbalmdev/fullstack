import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUsers, addUser, deleteUser, getUser,updateUser } from "../actions/userActions";
import { User } from "../../types";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  user:User
}

const initialState: UserState = {
  users: [],
  user:{
    name: "",
    interest: [],
    age: 0,
    mobile: 0,
    email: "",
    password: ""
  },
  loading: false,
  error: null,
};


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    updateUser(state, action: PayloadAction<User>) {
      const index = state.users.findIndex((user) => user._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      })
      // get user
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        // state.users = state.users.map(user => user._id === action.payload._id ? action.payload : user);
        state.user = action.payload 
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user";
      })

      // Add User
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add user";
      })
      // update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users = state.users.map(user => user._id === action.payload._id ? action.payload : user);
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user";
      });
      // update user
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;
