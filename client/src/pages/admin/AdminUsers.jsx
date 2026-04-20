// src/pages/admin/AdminUsers.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/users").then((r) => {
      setUsers(r.data);
      setLoading(false);
    });
  }, []);

  const toggleStatus = async (id) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/toggle`);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: data.isActive } : u)),
      );
      toast.success(data.message);
    } catch {
      toast.error("Action failed");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin" className="text-emerald-600 hover:underline text-sm">
          ← Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Users ({users.length})
        </h1>
      </div>
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Name", "Email", "Phone", "Joined", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {u.name}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3 text-gray-500">{u.phone}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStatus(u._id)}
                        className={`text-xs px-3 py-1 rounded-lg font-medium transition ${u.isActive ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
