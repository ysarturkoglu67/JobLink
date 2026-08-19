import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import Navbar from "../components/layout/Navbar";

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ========================================== */}
      {/* NAVBAR */}
      {/* ========================================== */}

      <Navbar />

      {/* ========================================== */}
      {/* DASHBOARD AREA */}
      {/* ========================================== */}

      <div className="flex min-h-[calc(100vh-73px)]">

        {/* ====================================== */}
        {/* SIDEBAR - SADECE DESKTOP */}
        {/* ====================================== */}

        <aside className="hidden lg:flex w-64 shrink-0 bg-slate-900 text-white flex-col">

          {/* Logo */}

          <div className="p-6 border-b border-slate-700">

            <h1 className="text-2xl font-bold">
              Kariyerİnşa.com
            </h1>

          </div>

          {/* Menü */}

          <nav className="flex-1 flex flex-col p-4 gap-2">

            {/* Ana Sayfa */}

            <Link
              to="/"
              className="hover:bg-slate-700 rounded-lg p-3 transition"
            >
              🏠 Ana Sayfa
            </Link>

            {/* ================================= */}
            {/* CANDIDATE */}
            {/* ================================= */}

            {user?.role === "candidate" && (
              <>
                <Link
                  to="/candidate"
                  className="hover:bg-slate-700 rounded-lg p-3 transition"
                >
                  📊 Dashboard
                </Link>

                <Link
                  to="/candidate/profile"
                  className="hover:bg-slate-700 rounded-lg p-3 transition"
                >
                  👤 Profilim
                </Link>

                <Link
                  to="/candidate/applications"
                  className="hover:bg-slate-700 rounded-lg p-3 transition"
                >
                  📄 Başvurularım
                </Link>

                <Link
                  to="/candidate/saved-jobs"
                  className="hover:bg-slate-700 rounded-lg p-3 transition"
                >
                  ❤️ Favorilerim
                </Link>

                <Link
                  to="/candidate/interviews"
                  className="hover:bg-slate-700 rounded-lg p-3 transition"
                >
                  📅 Mülakatlarım
                </Link>
              </>
            )}

            {/* ================================= */}
            {/* EMPLOYER */}
            {/* ================================= */}

            {user?.role === "employer" && (
              <>
                <Link
                  to="/employer"
                  className="hover:bg-slate-700 rounded-lg p-3 transition"
                >
                  📊 Dashboard
                </Link>

                <Link
                  to="/employer/jobs"
                  className="hover:bg-slate-700 rounded-lg p-3 transition"
                >
                  💼 İlanlarım
                </Link>

                <Link
                  to="/employer/create-job"
                  className="hover:bg-slate-700 rounded-lg p-3 transition"
                >
                  ➕ İlan Oluştur
                </Link>

                <Link
                  to="/employer/applicants"
                  className="hover:bg-slate-700 rounded-lg p-3 transition"
                >
                  👥 Başvurular
                </Link>

                <Link
                  to="/employer/company-profile"
                  className="hover:bg-slate-700 rounded-lg p-3 transition"
                >
                  🏢 Firma Profili
                </Link>

                <Link
                  to="/employer/interviews"
                  className="hover:bg-slate-700 rounded-lg p-3 transition"
                >
                  📅 Mülakatlar
                </Link>
              </>
            )}

            {/* ================================= */}
            {/* ADMIN */}
            {/* ================================= */}

            {user?.role === "admin" && (
              <>
                <Link
                  to="/admin"
                  className="hover:bg-slate-700 rounded-lg p-3 transition"
                >
                  📊 Dashboard
                </Link>

                <Link
                  to="/admin/users"
                  className="hover:bg-slate-700 rounded-lg p-3 transition"
                >
                  👥 Kullanıcılar
                </Link>

                <Link
                  to="/admin/jobs"
                  className="hover:bg-slate-700 rounded-lg p-3 transition"
                >
                  💼 İlanlar
                </Link>
              </>
            )}

            {/* ================================= */}
            {/* ORTAK */}
            {/* ================================= */}

            <Link
              to="/messages"
              className="hover:bg-slate-700 rounded-lg p-3 transition"
            >
              💬 Mesajlar
            </Link>

            <Link
              to="/notifications"
              className="hover:bg-slate-700 rounded-lg p-3 transition"
            >
              🔔 Bildirimler
            </Link>

          </nav>

          {/* ================================= */}
          {/* KULLANICI */}
          {/* ================================= */}

          <div className="p-4 border-t border-slate-700">

            <p className="mb-4 font-semibold truncate">
              {user?.name}
            </p>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 rounded-lg py-2 transition"
            >
              Çıkış Yap
            </button>

          </div>

        </aside>

        {/* ====================================== */}
        {/* İÇERİK */}
        {/* ====================================== */}

        <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-10 overflow-x-hidden">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;