import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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

      const res = await api.post("/auth/login", form);

      dispatch(
    loginSuccess({
    token: res.data.token,
    user: res.data.user,
  })
);

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Giriş Yap
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Şifre"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <button
            className="w-full bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Giriş Yapiliyor..." : "Giriş Yap"}
          </button>

        </form>

        <p className="mt-6 text-center">
          Hesabin yok mu?{" "}
          <Link
            to="/register"
            className="text-blue-600"
          >
            Kayit Ol
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;