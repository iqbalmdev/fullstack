import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/, // Email validation
  },
  password: { type: String, required: true },
  interest: { type: [String], required: true }, // Array of strings
  age: { type: Number, required: true }, // Integer
  mobile: { type: Number, required: true }, // Long
  deleted: { type: Number, default: 0 }, // Soft deletion: 0 for active, 1 for deleted
});

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  interest: string[];
  age: number;
  mobile: number;
}
