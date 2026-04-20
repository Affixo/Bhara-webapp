import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiPlusCircle,
  FiGrid,
} from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-emerald-600"
          >
            <FiHome className="text-3xl" />
            Bhara
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/listings"
              className="text-gray-600 hover:text-emerald-600 font-medium transition"
            >
              Browse To-Let
            </Link>
            {user && (
              <Link
                to="/create"
                className="flex items-center gap-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
              >
                <FiPlusCircle /> Post Rental
              </Link>
            )}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-emerald-600"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={`http://localhost:5000${user.avatar}`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name?.[0]?.toUpperCase()
                    )}
                  </div>
                  <span className="font-medium">{user.name}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <FiUser /> My Profile
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <FiGrid /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-emerald-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link
            to="/listings"
            onClick={() => setOpen(false)}
            className="block text-gray-700 font-medium"
          >
            Browse To-Let
          </Link>
          {user && (
            <Link
              to="/create"
              onClick={() => setOpen(false)}
              className="block text-emerald-600 font-medium"
            >
              Post Rental
            </Link>
          )}
          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="block text-gray-700 font-medium"
              >
                My Profile
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="block text-gray-700 font-medium"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block text-red-600 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block text-gray-700 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="block text-emerald-600 font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
