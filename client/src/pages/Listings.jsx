import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ListingCard from "../components/ListingCard";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

const TYPES = ["family", "bachelor", "sublet", "office", "seat"];
const FURNISHED = ["furnished", "semi-furnished", "unfurnished"];
const CITIES = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Comilla",
];

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    area: "",
    minRent: "",
    maxRent: "",
    bedrooms: "",
    furnished: "",
    page: 1,
    sort: "-createdAt",
  });

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== ""),
      );
      const { data } = await api.get("/listings", { params });
      setListings(data.listings);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "",
      city: "",
      area: "",
      minRent: "",
      maxRent: "",
      bedrooms: "",
      furnished: "",
      page: 1,
      sort: "-createdAt",
    });
    setSearchParams({});
  };

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Browse To-Let</h1>
          <p className="text-gray-500 text-sm">{total} listings found</p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings..."
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50"
          >
            <FiFilter /> Filters
          </button>
          <select
            value={filters.sort}
            onChange={(e) => handleChange("sort", e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
          >
            <option value="-createdAt">Newest</option>
            <option value="rent">Price: Low</option>
            <option value="-rent">Price: High</option>
            <option value="-views">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 shadow-sm">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className={inputCls}
            >
              <option value="">All Types</option>
              {TYPES.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              City
            </label>
            <select
              value={filters.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className={inputCls}
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              Area / Thana
            </label>
            <input
              type="text"
              placeholder="e.g. Gulshan"
              value={filters.area}
              onChange={(e) => handleChange("area", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              Bedrooms
            </label>
            <select
              value={filters.bedrooms}
              onChange={(e) => handleChange("bedrooms", e.target.value)}
              className={inputCls}
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}+
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              Min Rent (৳)
            </label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={filters.minRent}
              onChange={(e) => handleChange("minRent", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              Max Rent (৳)
            </label>
            <input
              type="number"
              placeholder="e.g. 30000"
              value={filters.maxRent}
              onChange={(e) => handleChange("maxRent", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">
              Furnished
            </label>
            <select
              value={filters.furnished}
              onChange={(e) => handleChange("furnished", e.target.value)}
              className={inputCls}
            >
              <option value="">Any</option>
              {FURNISHED.map((f) => (
                <option key={f} value={f} className="capitalize">
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
            >
              <FiX /> Clear all
            </button>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-2xl h-72 animate-pulse"
              />
            ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🏠</p>
          <h3 className="text-xl font-semibold text-gray-600">
            No listings found
          </h3>
          <p className="text-gray-400 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((l) => (
            <ListingCard key={l._id} listing={l} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handleChange("page", p)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition ${filters.page === p ? "bg-emerald-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
