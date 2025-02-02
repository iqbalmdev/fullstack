"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState({ email: "", user: "" });

  useEffect(() => {
    setUser({ email: "test@user.com", user: "Test User" });
  }, []);

  return (
    <div className="card bg-white shadow-md p-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p><strong>Name:</strong> {user.user}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}
