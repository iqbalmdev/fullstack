// components/AuthWrapper.tsx
'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Navbar from './Navbar';
import Login from './Login';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { authenticated } = useSelector((state: RootState) => state.auth);
  const token  = localStorage.getItem('user')

  return (
    <>
      {authenticated || token ? <Navbar /> : <Login />}
      {children}
    </>
  );
}