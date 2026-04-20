import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/listings").then((r) => {
      setListings(r.data);
      setLoading(false);
    });
  }, []);

  const toggleApproval = async (id) => {
    try {
      const { data } = await api.put(`/admin/listings/${id}/toggle`);
      setListings((prev) =>
        prev.map((l) =>
          l._id === id ? { ...l, isApproved: data.isApproved } : l,
        ),
      );
      toast.success(data.message);
    } catch {
      toast.error("Action failed");
    }
  };

  const deleteListing = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await api.delete(`/admin/listings/${id}`);
      setListings((prev) => prev.filter((l) => l._id !== id));
      toast.success("Listing deleted");
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
          Listings ({listings.length})
        </h1>
      </div>
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-3">
          {listings.map((l) => (
            <div
              key={l._id}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-center shadow-sm"
            >
              <img
                src={
                  l.images?.[0]
                    ? `http://localhost:5000${l.images[0]}`
                    : "https://placehold.co/80x80/e2e8f0/64748b?text=No+Img"
                }
                alt=""
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/listings/${l._id}`}
                  className="font-semibold text-gray-800 hover:text-emerald-600 truncate block"
                >
                  {l.title}
                </Link>
                <p className="text-sm text-gray-500">
                  {l.location?.city} · ৳{l.rent?.toLocaleString()}/mo · {l.type}{" "}
                  · By: {l.owner?.name}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${l.isApproved ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                >
                  {l.isApproved ? "Approved" : "Hidden"}
                </span>
                <button
                  onClick={() => toggleApproval(l._id)}
                  className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition"
                >
                  {l.isApproved ? "Hide" : "Approve"}
                </button>
                <button
                  onClick={() => deleteListing(l._id)}
                  className="text-xs px-3 py-1.5 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
