import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-md">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          JobLink
        </Link>

        <div className="flex items-center gap-6">

          <Link to="/">
            Ana Sayfa
          </Link>

          {user?.role === "candidate" && (
            <>
              <Link to="/candidate">
                Dashboard
              </Link>

              <Link to="/candidate/profile">
                Profilim
              </Link>

              <Link to="/candidate/applications">
                Başvurularım
              </Link>

              <Link to="/candidate/saved-jobs">
                Favorilerim
              </Link>
            </>
          )}

          {user?.role === "employer" && (
            <>
              <Link to="/employer">
                Dashboard
              </Link>

              <Link to="/employer/create-job">
                İlan Oluştur
              </Link>

              <Link to="/employer/jobs">
                İlanlarım
              </Link>

              <Link to="/employer/applicants">
                Başvurular
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <Link to="/admin">
              Admin
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login">
                Giriş Yap
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Kayıt Ol
              </Link>
            </>
          ) : (
            <>
              <span className="font-semibold">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Çıkış Yap
              </button>
            </>
          )}

        </div>

      </div>

    </nav>
  );
};

export default Navbar;