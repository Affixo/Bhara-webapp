import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiArrowRight } from "react-icons/fi";

const TYPES = [
  { label: "Family", value: "family", emoji: "👨‍👩‍👧‍👦" },
  { label: "Bachelor", value: "bachelor", emoji: "🧑" },
  { label: "Sub-let", value: "sublet", emoji: "🔑" },
  { label: "Office", value: "office", emoji: "🏢" },
  { label: "Seat", value: "seat", emoji: "🛏️" },
];

const POPULAR_CITIES = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Comilla",
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            Find Your Perfect <br />
            <span className="text-yellow-300">To-Let</span> in Bangladesh
          </h1>
          <p className="text-emerald-100 text-xl mb-10">
            Thousands of verified rental listings — Family, Bachelor, Sub-let,
            and more
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 shadow-2xl max-w-3xl mx-auto"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by area, title..."
              className="flex-1 px-4 py-3 text-gray-700 rounded-xl outline-none"
            />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-4 py-3 text-gray-700 rounded-xl outline-none border border-gray-200 bg-gray-50"
            >
              <option value="">All Cities</option>
              {POPULAR_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition"
            >
              <FiSearch /> Search
            </button>
          </form>
        </div>
      </section>

      {/* Type Cards */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Browse by Type
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Choose what fits your needs
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => navigate(`/listings?type=${t.value}`)}
              className="bg-white border border-gray-200 rounded-2xl p-5 text-center hover:border-emerald-400 hover:shadow-md transition group flex flex-col items-center"
            >
              <span className="text-4xl mb-2">{t.emoji}</span>
              <span className="font-semibold text-gray-700 group-hover:text-emerald-600 transition">
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Popular Cities */}
      <section className="bg-gray-100 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Popular Cities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {POPULAR_CITIES.map((c) => (
              <button
                key={c}
                onClick={() => navigate(`/listings?city=${c}`)}
                className="bg-white rounded-xl py-4 font-medium text-gray-700 hover:bg-emerald-600 hover:text-white transition shadow-sm border border-gray-200"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center bg-white">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Have a Property to Rent?
        </h2>
        <p className="text-gray-500 mb-6">
          List your property for free and reach thousands of potential tenants
        </p>
        <button
          onClick={() => navigate("/create")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl inline-flex items-center gap-2 text-lg transition"
        >
          Post Your Rental <FiArrowRight />
        </button>
      </section>
    </div>
  );
}
