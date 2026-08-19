import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import socket from "../../socket";

import {
  Bell,
  User,
  Heart,
  LogOut,
  LayoutDashboard,
  MessageCircle,
  Briefcase,
  Shield,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [notificationCount, setNotificationCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ==========================================
  // BİLDİRİM SAYISI
  // ==========================================

  const loadNotificationCount = async () => {
    try {
      const res = await api.get("/notifications/unread-count");

      setNotificationCount(res.data.count || 0);
    } catch (error) {
      console.log(
        "Bildirim sayısı alınamadı:",
        error
      );
    }
  };

  useEffect(() => {
    if (!user) {
      setNotificationCount(0);
      return;
    }

    loadNotificationCount();

    const handleNotification = () => {
      loadNotificationCount();
    };

    socket.on(
      "receive-notification",
      handleNotification
    );

    return () => {
      socket.off(
        "receive-notification",
        handleNotification
      );
    };
  }, [user]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    setMobileMenuOpen(false);

    dispatch(logout());

    localStorage.clear();

    navigate("/login");
  };

  // ==========================================
  // MOBİL MENÜ KAPAT
  // ==========================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // ==========================================
  // MOBİL LINK
  // ==========================================

  const MobileLink = ({
    to,
    children,
    icon,
  }) => {
    return (
      <Link
        to={to}
        onClick={closeMobileMenu}
        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition"
      >
        {icon}
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <>
      {/* ========================================== */}
      {/* DESKTOP + MOBILE HEADER */}
      {/* ========================================== */}

      <nav className="bg-white shadow border-b relative z-50">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">

          {/* LOGO */}

          <Link
            to="/"
            className="text-3xl font-bold text-blue-600"
          >
            Kariyerİnşa.com
          </Link>

          {/* ====================================== */}
          {/* DESKTOP MENU */}
          {/* ====================================== */}

          <div className="hidden lg:flex items-center gap-6">

            {/* Ana Sayfa */}

            <Link
              to="/"
              className="hover:text-blue-600"
            >
              Ana Sayfa
            </Link>

            {/* ================= CANDIDATE ================= */}

            {user?.role === "candidate" && (
              <>
                <Link
                  to="/candidate"
                  className="flex items-center gap-2 hover:text-blue-600"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <Link
                  to="/candidate/profile"
                  className="flex items-center gap-2 hover:text-blue-600"
                >
                  <User size={18} />
                  Profilim
                </Link>

                <Link
                  to="/candidate/applications"
                  className="hover:text-blue-600"
                >
                  Başvurularım
                </Link>

                <Link
                  to="/candidate/saved-jobs"
                  className="flex items-center gap-2 hover:text-blue-600"
                >
                  <Heart size={18} />
                  Favoriler
                </Link>

                <Link
                  to="/candidate/interviews"
                  className="hover:text-blue-600"
                >
                  Mülakatlarım
                </Link>
              </>
            )}

            {/* ================= EMPLOYER ================= */}

            {user?.role === "employer" && (
              <>
                <Link
                  to="/employer"
                  className="flex items-center gap-2 hover:text-blue-600"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <Link
                  to="/employer/jobs"
                  className="flex items-center gap-2 hover:text-blue-600"
                >
                  <Briefcase size={18} />
                  İlanlarım
                </Link>

                <Link
                  to="/employer/create-job"
                  className="hover:text-blue-600"
                >
                  İlan Oluştur
                </Link>

                <Link
                  to="/employer/interviews"
                  className="hover:text-blue-600"
                >
                  Mülakatlar
                </Link>
              </>
            )}

            {/* ================= ADMIN ================= */}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center gap-2 hover:text-blue-600"
              >
                <Shield size={18} />
                Admin
              </Link>
            )}

            {/* ================= MESAJ ================= */}

            {user && (
              <Link
                to="/messages"
                className="relative hover:text-blue-600"
                title="Mesajlar"
              >
                <MessageCircle size={22} />
              </Link>
            )}

            {/* ================= BİLDİRİM ================= */}

            {user && (
              <Link
                to="/notifications"
                className="relative hover:text-blue-600"
                title="Bildirimler"
              >
                <Bell size={22} />

                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                    {notificationCount > 99
                      ? "99+"
                      : notificationCount}
                  </span>
                )}
              </Link>
            )}

            {/* ================= LOGIN ================= */}

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-600"
                >
                  Giriş Yap
                </Link>

                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Kayıt Ol
                </Link>
              </>
            ) : (
              <>
                {/* Kullanıcı */}

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">

                    {user?.avatar ? (
                      <img
                        src={
                          user.avatar.startsWith(
                            "http"
                          )
                            ? user.avatar
                            : `http://localhost:5000${user.avatar}`
                        }
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <span className="text-blue-600 font-bold text-lg">
                        {user?.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </span>
                    )}

                  </div>

                  <span className="font-semibold">
                    {user.name}
                  </span>

                </div>

                {/* Çıkış */}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  <LogOut size={18} />
                  Çıkış Yap
                </button>
              </>
            )}

          </div>

          {/* ====================================== */}
          {/* MOBILE MENU BUTTON */}
          {/* ====================================== */}

          <button
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Menüyü aç"
          >
            {mobileMenuOpen ? (
              <X size={30} />
            ) : (
              <Menu size={30} />
            )}
          </button>

        </div>

      </nav>

      {/* ========================================== */}
      {/* MOBILE OVERLAY */}
      {/* ========================================== */}

      {mobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* ========================================== */}
      {/* MOBILE DRAWER */}
      {/* ========================================== */}

      <aside
        className={`
          fixed
          top-0
          right-0
          h-screen
          w-[300px]
          max-w-[85vw]
          bg-white
          shadow-2xl
          z-50
          lg:hidden
          transform
          transition-transform
          duration-300
          overflow-y-auto
          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >

        {/* Drawer Header */}

        <div className="flex items-center justify-between p-5 border-b">

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="text-2xl font-bold text-blue-600"
          >
            Kariyerİnşa.com
          </Link>

          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={26} />
          </button>

        </div>

        {/* Drawer İçeriği */}

        <div className="p-4">

          {/* Ana Sayfa */}

          <MobileLink to="/">
            🏠 Ana Sayfa
          </MobileLink>

          {/* ================= CANDIDATE ================= */}

          {user?.role === "candidate" && (
            <div className="mt-2 space-y-1">

              <MobileLink
                to="/candidate"
                icon={<LayoutDashboard size={18} />}
              >
                Dashboard
              </MobileLink>

              <MobileLink
                to="/candidate/profile"
                icon={<User size={18} />}
              >
                Profilim
              </MobileLink>

              <MobileLink to="/candidate/applications">
                📄 Başvurularım
              </MobileLink>

              <MobileLink
                to="/candidate/saved-jobs"
                icon={<Heart size={18} />}
              >
                Favoriler
              </MobileLink>

              <MobileLink to="/candidate/interviews">
                📅 Mülakatlarım
              </MobileLink>

            </div>
          )}

          {/* ================= EMPLOYER ================= */}

          {user?.role === "employer" && (
            <div className="mt-2 space-y-1">

              <MobileLink
                to="/employer"
                icon={<LayoutDashboard size={18} />}
              >
                Dashboard
              </MobileLink>

              <MobileLink
                to="/employer/jobs"
                icon={<Briefcase size={18} />}
              >
                İlanlarım
              </MobileLink>

              <MobileLink to="/employer/create-job">
                ➕ İlan Oluştur
              </MobileLink>

              <MobileLink to="/employer/interviews">
                📅 Mülakatlar
              </MobileLink>

            </div>
          )}

          {/* ================= ADMIN ================= */}

          {user?.role === "admin" && (
            <MobileLink
              to="/admin"
              icon={<Shield size={18} />}
            >
              Admin Paneli
            </MobileLink>
          )}

          {/* ================= MESAJ ================= */}

          {user && (
            <MobileLink
              to="/messages"
              icon={<MessageCircle size={18} />}
            >
              Mesajlar
            </MobileLink>
          )}

          {/* ================= BİLDİRİM ================= */}

          {user && (
            <Link
              to="/notifications"
              onClick={closeMobileMenu}
              className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-3">
                <Bell size={18} />
                <span>Bildirimler</span>
              </div>

              {notificationCount > 0 && (
                <span className="bg-red-600 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                  {notificationCount > 99
                    ? "99+"
                    : notificationCount}
                </span>
              )}
            </Link>
          )}

          {/* ====================================== */}
          {/* LOGIN / USER */}
          {/* ====================================== */}

          <div className="border-t mt-4 pt-4">

            {!user ? (
              <div className="space-y-2">

                <MobileLink to="/login">
                  Giriş Yap
                </MobileLink>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="block bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-3 rounded-lg"
                >
                  Kayıt Ol
                </Link>

              </div>
            ) : (
              <>

                {/* Kullanıcı Bilgisi */}

                <div className="bg-gray-50 rounded-xl p-4 mb-3">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">

                      {user?.avatar ? (
                        <img
                          src={
                            user.avatar.startsWith(
                              "http"
                            )
                              ? user.avatar
                              : `http://localhost:5000${user.avatar}`
                          }
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-blue-600 font-bold text-lg">
                          {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}
                        </span>
                      )}

                    </div>

                    <div className="min-w-0">

                      <p className="font-semibold truncate">
                        {user.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {user.role}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Çıkış */}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg"
                >
                  <LogOut size={18} />
                  Çıkış Yap
                </button>

              </>
            )}

          </div>

        </div>

      </aside>
    </>
  );
};

export default Navbar;