import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ListingCard from "../components/ListingCard";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiPhone, FiEdit } from "react-icons/fi";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("listings");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [l, s, r] = await Promise.all([
      api.get("/listings/my"),
      api.get("/requests/my"),
      api.get("/requests/received"),
    ]);
    setMyListings(l.data);
    setSentRequests(s.data);
    setReceivedRequests(r.data);
  };

  const handleRequestAction = async (id, status) => {
    try {
      await api.put(`/requests/${id}`, { status });
      toast.success(`Request ${status}`);
      fetchAll();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("phone", form.phone);
      if (avatarFile) fd.append("avatar", avatarFile);
      const { data } = await api.put("/auth/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(data);
      toast.success("Profile updated");
      setEditMode(false);
    } catch {
      toast.error("Update failed");
    }
    setSaving(false);
  };

  const tabs = [
    { key: "listings", label: `My Listings (${myListings.length})` },
    { key: "sent", label: `Sent Requests (${sentRequests.length})` },
    {
      key: "received",
      label: `Received Requests (${receivedRequests.length})`,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm flex flex-col md:flex-row items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-3xl overflow-hidden shrink-0">
          {user?.avatar ? (
            <img
              src={`http://localhost:5000${user.avatar}`}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            user?.name?.[0]?.toUpperCase()
          )}
        </div>
        {editMode ? (
          <form onSubmit={handleSaveProfile} className="flex-1 space-y-3">
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <input
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="text-sm text-gray-500"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-70"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="border border-gray-200 px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
              {user?.role === "admin" && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                  Admin
                </span>
              )}
            </div>
            <p className="flex items-center gap-1 text-gray-500 text-sm mb-0.5">
              <FiMail className="text-emerald-500" /> {user?.email}
            </p>
            <p className="flex items-center gap-1 text-gray-500 text-sm">
              <FiPhone className="text-emerald-500" /> {user?.phone}
            </p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 flex items-center gap-1 text-sm text-emerald-600 hover:underline"
            >
              <FiEdit /> Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === t.key ? "bg-white shadow text-emerald-700" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "listings" &&
        (myListings.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            No listings yet.{" "}
            <a href="/create" className="text-emerald-600 underline">
              Post your first one!
            </a>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {myListings.map((l) => (
              <ListingCard key={l._id} listing={l} />
            ))}
          </div>
        ))}

      {activeTab === "sent" &&
        (sentRequests.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            You haven't sent any rent requests yet.
          </p>
        ) : (
          <div className="space-y-4">
            {sentRequests.map((r) => (
              <div
                key={r._id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex gap-4"
              >
                <img
                  src={
                    r.listing?.images?.[0]
                      ? `http://localhost:5000${r.listing.images[0]}`
                      : "https://placehold.co/80x80"
                  }
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {r.listing?.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    ৳{r.listing?.rent?.toLocaleString()}/mo ·{" "}
                    {r.listing?.location?.city}
                  </p>
                  {r.message && (
                    <p className="text-sm text-gray-400 mt-1 italic">
                      "{r.message}"
                    </p>
                  )}
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full h-fit ${STATUS_COLORS[r.status]}`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        ))}

      {activeTab === "received" &&
        (receivedRequests.length === 0 ? (
          <p className="text-center text-gray-400 py-12">
            No one has sent a request for your properties yet.
          </p>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((r) => (
              <div
                key={r._id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-lg overflow-hidden shrink-0">
                    {r.requester?.avatar ? (
                      <img
                        src={`http://localhost:5000${r.requester.avatar}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      r.requester?.name?.[0]?.toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {r.requester?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {r.requester?.phone} · {r.requester?.email}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      For:{" "}
                      <span className="text-gray-700 font-medium">
                        {r.listing?.title}
                      </span>
                    </p>
                    {r.message && (
                      <p className="text-sm text-gray-400 mt-1 italic">
                        "{r.message}"
                      </p>
                    )}
                    {r.moveInDate && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Move-in: {new Date(r.moveInDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                {r.status === "pending" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleRequestAction(r._id, "approved")}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-sm font-medium transition"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleRequestAction(r._id, "rejected")}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-2 rounded-xl text-sm font-medium transition"
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
