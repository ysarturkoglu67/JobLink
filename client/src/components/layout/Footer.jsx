import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-20">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-3 gap-10">

          <div>

            <h2 className="text-2xl font-bold">
              Kariyerİnşa.com
            </h2>

            <p className="text-gray-400 mt-4">
              Türkiye'nin yeni nesil iş bulma platformu.
            </p>

          </div>

          <div>

            <h3 className="font-bold mb-4">
              Sayfalar
            </h3>

            <div className="flex flex-col gap-2">

              <Link to="/">Ana Sayfa</Link>

              <Link to="/login">
                Giriş Yap
              </Link>

              <Link to="/register">
                Kayıt Ol
              </Link>

            </div>

          </div>

          <div>

            <h3 className="font-bold mb-4">
              İletişim
            </h3>

            <p>info@Kariyerİnşa.com</p>

            <p className="mt-2">
              İstanbul / Türkiye
            </p>

          </div>

        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 text-center text-gray-400">
          © 2026 Kariyerİnşa.com Tüm hakları saklıdır.
        </div>

      </div>

    </footer>
  );
};

export default Footer;