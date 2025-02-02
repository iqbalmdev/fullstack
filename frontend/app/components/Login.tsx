"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { loginUser } from "../../redux/actions/authActions";
import { useRouter } from "next/navigation";

export default function Login() {
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Ensures we're in the client-side
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `alert ${type === "success" ? "alert-success" : "alert-error"} shadow-lg w-full max-w-xs`;
    toast.innerHTML = `<span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors: { email?: string; password?: string } = {};

    // Validate email
    if (!email) formErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) formErrors.email = "Email is invalid.";

    // Validate password
    if (!password) formErrors.password = "Password is required.";
    else if (password.length < 6)
      formErrors.password = "Password must be at least 6 characters.";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);

    dispatch(
      loginUser({
        email,
        password,
        callback: (response) => {
          setIsLoading(false);
          if (response) {
            showToast("Login successful! 🎉", "success");
            setTimeout(() => router.push("/"), 1000);
          }
        },
      })
    ).unwrap()
      .catch((error) => {
        setIsLoading(false);
        showToast(error || "Invalid credentials", "error");
      });
  };

  if (!isClient) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Toast Container */}
      <div id="toast-container" className="fixed top-5 right-5 z-50 space-y-2"></div>

      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center">Login</h2>
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
              <button
                type="submit"
                className={`btn ${isLoading ? "btn-disabled" : "btn-primary"} w-full`}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
