// src/components/ListingCard.jsx
import { Link } from "react-router-dom";
import { FiMapPin, FiHome, FiDollarSign, FiEye } from "react-icons/fi";

const TYPE_COLORS = {
  family: "bg-blue-100 text-blue-700",
  bachelor: "bg-yellow-100 text-yellow-700",
  sublet: "bg-purple-100 text-purple-700",
  office: "bg-red-100 text-red-700",
  seat: "bg-green-100 text-green-700",
};

export default function ListingCard({ listing }) {
  const img = listing.images?.[0]
    ? `http://localhost:5000${listing.images[0]}`
    : "https://placehold.co/400x250/e2e8f0/64748b?text=No+Image";

  return (
    <Link
      to={`/listings/${listing._id}`}
      className="group bg-white rounded-2xl shadow hover:shadow-xl transition-all overflow-hidden border border-gray-100 flex flex-col"
    >
      <div className="relative">
        <img
          src={img}
          alt={listing.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span
          className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full capitalize ${TYPE_COLORS[listing.type] || "bg-gray-100 text-gray-700"}`}
        >
          {listing.type}
        </span>
        {listing.status === "rented" && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Rented
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800 text-lg leading-tight line-clamp-1 group-hover:text-emerald-600 transition">
          {listing.title}
        </h3>
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
          <FiMapPin className="text-emerald-500 shrink-0" />
          {listing.location?.area && `${listing.location.area}, `}
          {listing.location?.city}
        </p>
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <FiHome /> {listing.bedrooms} Bed
          </span>
          <span className="flex items-center gap-1 capitalize">
            {listing.furnished}
          </span>
          <span className="flex items-center gap-1 ml-auto text-gray-400">
            <FiEye /> {listing.views}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <p className="text-emerald-600 font-bold text-lg">
            ৳{listing.rent.toLocaleString()}
            <span className="text-gray-400 font-normal text-sm">/mo</span>
          </p>
          {listing.negotiable && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              Negotiable
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
