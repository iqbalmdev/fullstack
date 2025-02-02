import { Schema, Document } from 'mongoose';

export const AuthSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/, // Validate email format
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Role-based access
});

export interface Auth extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}
