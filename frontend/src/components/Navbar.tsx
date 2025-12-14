"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍬</span>
            <span className="text-xl font-bold text-purple-600">Sweet Shop</span>
          </Link>

          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                  Dashboard
                </Link>
                {user?.role === "admin" && (
                  <Link to="/admin" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
