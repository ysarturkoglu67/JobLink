import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          JobLink
        </Link>

        <div className="flex items-center gap-8">

          <Link
            to="/"
            className="hover:text-blue-600"
          >
            İş İlanlari
          </Link>

          <Link
            to="/login"
            className="hover:text-blue-600"
          >
            Giriş
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Kayit Ol
          </Link>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;