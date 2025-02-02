'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { updateUser, getUser } from '../../redux/actions/userActions';
import { User } from '../../types';
import { useRouter } from 'next/navigation'; // Updated import for Next.js 13+
import { RootState } from '../../redux/store'; // Import RootState for type safety

interface UserFormProps {
  userId: string;
}

const UserForm: React.FC<UserFormProps> = ({ userId }) => {
  const [form, setForm] = useState<User>({
    name: '',
    email: '',
    password: '', // Avoid displaying passwords in forms unless necessary
    interest: [],
    age: 0,
    mobile: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  // Fetch user data when the component mounts or userId changes
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch the user data by ID
        await dispatch(getUser(userId));
      } catch (err) {
        console.log(err,"See error")
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, dispatch]);

  // Get user data from Redux store
  const user = useSelector((state: RootState) => state.user.user); // Adjust according to your state structure

  // Update form state with user data once it's loaded
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        password: user?.password, // Keep password empty for security
        interest: user.interest,
        age: user.age,
        mobile: user.mobile,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form && userId) {
      setSubmitting(true);
      try {
        await dispatch(
          updateUser({
            id: userId,
            updatedUser: form,
            callback: () => {
              router.push('/users'); // Redirect after successful update
            },
          }),
        );
      } catch (err) {
        console.log(err)
        setError('Failed to update user');
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <input
          type="text"
          placeholder="User Name"
          className="input input-bordered w-full"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      {/* Avoid displaying passwords in forms unless necessary */}
      <div>
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Interests (comma separated)"
          className="input input-bordered w-full"
          value={form.interest.join(',')}
          onChange={(e) => setForm({ ...form, interest: e.target.value.split(',') })}
        />
      </div>

      <div>
        <input
          type="number"
          placeholder="Age"
          className="input input-bordered w-full"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: +e.target.value })}
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Mobile Number"
          className="input input-bordered w-full"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: +e.target.value })}
        />
      </div>

      <button type="submit" className="btn btn-primary mt-4" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default UserForm;
