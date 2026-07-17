import { Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white">

        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold">
            JobLink
          </h1>
        </div>

        <nav className="flex flex-col p-4 gap-2">

          <Link
            to="/"
            className="hover:bg-slate-700 rounded-lg p-3"
          >
            Ana Sayfa
          </Link>

          {user?.role === "candidate" && (
            <>
              <Link
                to="/candidate"
                className="hover:bg-slate-700 rounded-lg p-3"
              >
                Dashboard
              </Link>

              <Link
                to="/candidate/applications"
                className="hover:bg-slate-700 rounded-lg p-3"
              >
                Başvurularım
              </Link>
            </>
          )}

          {user?.role === "employer" && (
            <>
              <Link
                to="/employer"
                className="hover:bg-slate-700 rounded-lg p-3"
              >
                Dashboard
              </Link>

              <Link
                to="/employer/jobs"
                className="hover:bg-slate-700 rounded-lg p-3"
              >
                İlanlarım
              </Link>

              <Link
                to="/employer/create-job"
                className="hover:bg-slate-700 rounded-lg p-3"
              >
                İlan Ekle
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link
                to="/admin"
                className="hover:bg-slate-700 rounded-lg p-3"
              >
                Admin Paneli
              </Link>

              <Link
                to="/admin/users"
                className="hover:bg-slate-700 rounded-lg p-3"
              >
                Kullanicilar
              </Link>
            </>
          )}

        </nav>

      </aside>

      {/* İçerik */}
      <main className="flex-1 p-10">

        <Outlet />

      </main>

    </div>
  );
};
<Link to="/candidate/applications">
  Başvurularim
</Link>

export default DashboardLayout;