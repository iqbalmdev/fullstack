"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store"; // Import the AppDispatch type
import { addUser } from "@/redux/actions/userActions"; // Assuming this action exists
import { User } from "../../../types"; // Make sure to import the correct type

export default function AddUserPage() {
  const [form, setForm] = useState<{ name: string; email: string; password: string; interest: string; age: string; mobile: string }>({
    name: "",
    email: "",
    password: "",
    interest: "",
    age: "",
    mobile: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>(); // Use the AppDispatch type
  const router = useRouter(); // Access Next.js router

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Name validation
    if (!form.name) {
      newErrors.name = "Name is required.";
    }

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid.";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // Interest validation
    if (!form.interest) {
      newErrors.interest = "Interest is required.";
    }

    // Age validation
    if (!form.age) {
      newErrors.age = "Age is required.";
    } else if (isNaN(Number(form.age)) || Number(form.age) <= 0) {
      newErrors.age = "Age must be a positive number.";
    }

    // Mobile validation
    if (!form.mobile) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(form.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Set loading state to true while processing
    setLoading(true);
    setError(null); // Reset any previous errors

    try {
      // Ensure `age` is passed as a number and other fields are correctly typed
      const userPayload: User = {
        name: form.name,
        email: form.email,
        password: form.password,
        interest: form.interest.split(","),
        age: +(form.age), // Convert age to a number
        mobile: +(form.mobile), // Convert mobile to a number
      };

      // Dispatch action to add user (assuming you have a userActions file)
      await dispatch(
        addUser({
          newUser: userPayload,
          callback: () => router.push("/users"), // Callback function for redirection
        })
      );

      // Redirect to users page after successfully adding the user
      router.push("/users"); // Replace with your desired users page URL

    } catch (err) {
      // Handle error (for example, show an error message)
      console.log(err)
      setError("Failed to add user");
    } finally {
      // Set loading to false after the operation completes
      setLoading(false);
    }
  };

  return (
    <div className="card bg-white shadow-md p-6 mx-auto w-96">
      <h2 className="text-2xl font-bold text-center">Add User</h2>

      {error && <p className="text-red-500 text-center">{error}</p>} {/* Display error message */}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            placeholder="User Name"
            className="input input-bordered w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Interests (comma separated)"
            className="input input-bordered w-full"
            value={form.interest}
            onChange={(e) => setForm({ ...form, interest: e.target.value })}
          />
          {errors.interest && <p className="text-red-500 text-sm">{errors.interest}</p>}
        </div>

        <div>
          <input
            type="number"
            placeholder="Age"
            className="input input-bordered w-full"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Mobile Number"
            className="input input-bordered w-full"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
        </div>

        <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
          {loading ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  );
}
