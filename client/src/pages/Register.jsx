import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiPhone, FiHome } from "react-icons/fi";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm)
      return toast.error("Passwords do not match");
    setLoading(true);
    try {
      const user = await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      toast.success(`Welcome to Bhara, ${user.name}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  const ic =
    "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-3xl font-extrabold text-emerald-600 mb-2">
            <FiHome /> Bhara
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Create an account
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Join thousands finding homes on Bhara
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            {
              icon: <FiUser />,
              name: "name",
              type: "text",
              placeholder: "Full Name",
            },
            {
              icon: <FiMail />,
              name: "email",
              type: "email",
              placeholder: "Email Address",
            },
            {
              icon: <FiPhone />,
              name: "phone",
              type: "tel",
              placeholder: "Phone Number",
            },
            {
              icon: <FiLock />,
              name: "password",
              type: "password",
              placeholder: "Password",
            },
            {
              icon: <FiLock />,
              name: "confirm",
              type: "password",
              placeholder: "Confirm Password",
            },
          ].map((f) => (
            <div key={f.name} className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {f.icon}
              </span>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
                }
                placeholder={f.placeholder}
                required
                className={ic}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
