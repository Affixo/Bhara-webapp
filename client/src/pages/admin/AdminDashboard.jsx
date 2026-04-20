import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data));
  }, []);

  const cards = stats
    ? [
        {
          label: "Total Users",
          value: stats.totalUsers,
          color: "bg-blue-500",
          emoji: "👥",
        },
        {
          label: "Total Listings",
          value: stats.totalListings,
          color: "bg-emerald-500",
          emoji: "🏠",
        },
        {
          label: "Available Now",
          value: stats.availableListings,
          color: "bg-teal-500",
          emoji: "✅",
        },
        {
          label: "Rent Requests",
          value: stats.totalRequests,
          color: "bg-purple-500",
          emoji: "📬",
        },
      ]
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Overview of the Bhara platform</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats
          ? cards.map((c) => (
              <div
                key={c.label}
                className={`${c.color} text-white rounded-2xl p-5 shadow`}
              >
                <div className="text-3xl mb-1">{c.emoji}</div>
                <div className="text-3xl font-extrabold">{c.value}</div>
                <div className="text-sm opacity-80">{c.label}</div>
              </div>
            ))
          : Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl h-28 animate-pulse"
                />
              ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            to: "/admin/users",
            title: "👥 Manage Users",
            desc: "View, activate or deactivate user accounts",
          },
          {
            to: "/admin/listings",
            title: "🏠 Manage Listings",
            desc: "Approve, review or remove listings",
          },
          {
            to: "/admin/requests",
            title: "📬 Rent Requests",
            desc: "View all rent requests across the platform",
          },
        ].map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition group"
          >
            <h2 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition">
              {l.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
