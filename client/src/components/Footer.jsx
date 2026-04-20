import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold text-emerald-400 mb-2">
            <FiHome /> Bhara
          </div>
          <p className="text-sm text-gray-400">
            Find your perfect home in Bangladesh. Browse thousands of To-Let
            listings across the country.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/listings"
                className="hover:text-emerald-400 transition"
              >
                Browse Listings
              </Link>
            </li>
            <li>
              <Link to="/create" className="hover:text-emerald-400 transition">
                Post Your Rental
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-emerald-400 transition">
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="hover:text-emerald-400 transition"
              >
                Register
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Rental Types</h4>
          <ul className="space-y-2 text-sm">
            {["Family", "Bachelor", "Sub-let", "Office", "Seat"].map((t) => (
              <li key={t}>
                <Link
                  to={`/listings?type=${t.toLowerCase()}`}
                  className="hover:text-emerald-400 transition"
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-8 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} Bhara. All rights reserved.
      </div>
    </footer>
  );
}
