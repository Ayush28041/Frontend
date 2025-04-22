import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div>
        <Link to="/dashboard" className="mr-4">Dashboard</Link>
        <Link to="/meeting-rooms" className="mr-4">Rooms</Link>
        <Link to="/reservations">Bookings</Link>
      </div>
      <div>
        {user ? (
          <>
            <span className="mr-4">{user.name}</span>
            <button onClick={handleLogout} className="text-red-400">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
