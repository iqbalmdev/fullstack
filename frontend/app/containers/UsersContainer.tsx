"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import Link from "next/link";
import { fetchUsers, deleteUser } from "../../redux/actions/userActions";

export default function UsersContainer() {
  const dispatch: AppDispatch = useDispatch();
  const { users } = useSelector((state: RootState) => state.user);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDeleteClick = (userId: string) => {
    setUserIdToDelete(userId);
    setDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (userIdToDelete) {
      await dispatch(deleteUser(userIdToDelete));
      setDeletePopupOpen(false);
      setUserIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeletePopupOpen(false);
    setUserIdToDelete(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Users List</h1>

      {/* Add User Button */}
      <div className="flex justify-end mb-4">
        <Link href="/users/add" className="btn btn-primary">
          + Add User
        </Link>
      </div>

      {/* User List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {users.map((user) => (
          <div key={user?._id} className="card bg-base-100 shadow-xl p-5">
            <div className="card-body">
              <h2 className="card-title">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>

              {/* Displaying Interests */}
              <div className="mt-2">
                <h3 className="font-semibold">Interests:</h3>
                <ul className="list-disc pl-5">
                  {user?.interest?.length > 0 && user.interest.map((interest, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {interest}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-actions justify-end mt-4">
                {/* Edit Button */}
                <Link href={`/users/${user._id}`} className="btn btn-outline btn-info btn-sm">
                  ✏️ Edit
                </Link>
                {/* Delete Button */}
                <button onClick={() => handleDeleteClick(user._id ? user._id :'')} className="btn btn-outline btn-error btn-sm">
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Popup */}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="flex justify-end mt-4">
              <button onClick={cancelDelete} className="btn btn-outline btn-secondary mr-2">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-outline btn-error">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
