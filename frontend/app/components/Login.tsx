"use client";

import { useState, useEffect } from "react";
// import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { loginUser } from "../../redux/actions/authActions";
export default function Login() {
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string, global?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch: AppDispatch = useDispatch();


  useEffect(() => {
    setIsClient(true); // Ensures we're in the client-side
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors: { email?: string; password?: string } = {};

    // Validate email
    if (!email) formErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) formErrors.email = 'Email is invalid.';

    // Validate password
    if (!password) formErrors.password = 'Password is required.';
    else if (password.length < 6) formErrors.password = 'Password must be at least 6 characters.';

    // If there are form errors, set them and prevent submission
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Simulate async login process
    setIsLoading(true);

    try {
      // Dispatch login action (using redux async thunk)
      dispatch(loginUser({ email, password }));

      // Clear form after successful login
      setEmail('');
      setPassword('');
      setErrors({});
      // Redirect to another page or handle post-login logic
    } catch (error) {
      setIsLoading(false);
      console.log(error)
      setErrors({ global: 'An error occurred. Please try again.' });
    }
  };

  if (!isClient) {
    // Ensure the router hook is used only on the client side
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center">Login</h2>
          {errors.global && (
            <div className="text-red-500 text-sm text-center mb-4">{errors.global}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <label className="label text-sm text-red-500">{errors.email}</label>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <label className="label text-sm text-red-500">{errors.password}</label>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-4 text-center">
            {/* <p>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
