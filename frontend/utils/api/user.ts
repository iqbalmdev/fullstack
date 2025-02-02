import { User } from "../../types";
import { userApi } from "../interceptor";

// Fetch all users
export const fetchUsersService = async (): Promise<User[]> => {
  const { data } = await userApi.get("/users");
  return data;
};

// Add a new user
export const addUserService = async (user: User): Promise<User> => {
  const { data } = await userApi.post("/users", user);
  return data;
};

// Delete a user
export const deleteUserService = async (id: string): Promise<void> => {
  await userApi.delete(`/users/${id}`);
};


// Fetch all users


// Fetch a single user by ID
export const getUserService = async (id: string): Promise<User> => {
  const response = await userApi.get(`/users/${id}`);
  return response.data;
};

// Add a new user


// Update a user
export const updateUserService = async (id: string, updatedUser: Partial<User>): Promise<User> => {
  const response = await userApi.put(`/users/${id}`, updatedUser);
  return response.data;
};
