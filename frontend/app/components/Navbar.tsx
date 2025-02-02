"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setAuthFalse } from "../../redux/slices/authSlice";

export default function Navbar() {

 
  const router = useRouter();
  const token = localStorage.getItem("user");
  const dispatch = useDispatch();
  const handleLogout = () => {
    // Remove token from cookies and user from localStorage
    Cookies.remove("token");
    localStorage.removeItem("user");

    // Dispatch the action to set authentication state to false
    dispatch(setAuthFalse());

    // Redirect the user to the login page
    router.push("/");
  };


  return (
<nav className="navbar bg-blue-600 text-white p-4" style={{display:"flex",justifyContent:"space-between"}}>
  <Link href="/" className="text-lg font-bold">Dashboard</Link>
  <div className="flex gap-6" style={{ paddingLeft: '10px' }}> {/* Increase the gap between items */}
    <Link href="/users">Users</Link>
  </div>
  <div>
    <div style={{paddingRight:'10px'}}>

    <Link href="/profile">Profile</Link>
    </div>
  {token && <button onClick={handleLogout}>Logout</button>} {/* Move Logout to the end */}
  {!token && <Link href="/login">Login</Link>} {/* Login visible when not logged in */}
  </div>
    
</nav>

  
  );
}

