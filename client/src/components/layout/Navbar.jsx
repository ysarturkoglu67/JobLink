import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

        <Link
          to="/"
          className="text-3xl font-bold text-blue-600"
        >
          JobLink
        </Link>

        <nav className="flex items-center gap-8">

          <Link
            to="/"
            className="hover:text-blue-600"
          >
            Ana Sayfa
          </Link>

          <Link
            to="/jobs"
            className="hover:text-blue-600"
          >
            İş İlanlari
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="hover:text-blue-600"
              >
                Giriş
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Kayit Ol
              </Link>
            </>
          ) : (
            <>
              <span className="font-semibold">
                {user.name}
              </span>
            </>
          )}

        </nav>

      </div>
    </header>
  );
};

export default Navbar;