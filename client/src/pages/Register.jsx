import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/auth/register", form);

      alert("Kayit başarili");

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Kayit başarisiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">
          Kayit Ol
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Ad Soyad"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Şifre"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <select
            className="w-full border p-3 rounded-lg"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="candidate">
              İş Arayan
            </option>

            <option value="employer">
              İşveren
            </option>
          </select>

          <button
            disabled={loading}
            className="bg-blue-600 text-white w-full p-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Oluşturuluyor..." : "Kayit Ol"}
          </button>

        </form>

        <p className="text-center mt-5">

          Hesabin var mi?

          <Link
            to="/login"
            className="text-blue-600 ml-2"
          >
            Giriş Yap
          </Link>

        </p>

      </div>

    </div>
  );
};
toast.success("Kayit başarili");

export default Register;