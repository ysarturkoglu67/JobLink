import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import api from "../../api/axios";
import toast from "react-hot-toast";

import { loginSuccess } from "../../redux/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const { user, token } = useSelector(
    (state) => state.auth
  );

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
    bio: user?.bio || "",
  });

  const [avatar, setAvatar] = useState(null);
  const [cv, setCv] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // =====================================================
  // FORM DEĞİŞİKLİĞİ
  // =====================================================

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================================
  // PROFİL GÜNCELLE
  // =====================================================

  const updateProfile = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Ad Soyad alanı boş bırakılamaz.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.put("/auth/profile", {
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        github: form.github.trim(),
        linkedin: form.linkedin.trim(),
        bio: form.bio.trim(),
      });

      dispatch(
        loginSuccess({
          token,
          user: res.data.user,
        })
      );

      setForm({
        name: res.data.user?.name || "",
        phone: res.data.user?.phone || "",
        city: res.data.user?.city || "",
        github: res.data.user?.github || "",
        linkedin: res.data.user?.linkedin || "",
        bio: res.data.user?.bio || "",
      });

      toast.success("Profil başarıyla güncellendi.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Profil güncellenemedi."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // AVATAR SEÇ
  // =====================================================

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) return;

    // 5 MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Profil fotoğrafı en fazla 5 MB olabilir."
      );

      e.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Sadece JPG, PNG veya WEBP fotoğraf yükleyebilirsiniz."
      );

      e.target.value = "";
      return;
    }

    setAvatar(file);
  };

  // =====================================================
  // AVATAR YÜKLE
  // =====================================================

  const uploadAvatar = async () => {
    if (!avatar) {
      toast.error("Lütfen bir profil fotoğrafı seçin.");
      return;
    }

    const formData = new FormData();

    formData.append("avatar", avatar);

    try {
      setUploadingAvatar(true);

      const res = await api.post(
        "/auth/upload-avatar",
        formData
      );

      dispatch(
        loginSuccess({
          token,
          user: {
            ...user,
            avatar: res.data.avatar,
          },
        })
      );

      setAvatar(null);

      toast.success(
        "Profil fotoğrafı başarıyla yüklendi."
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Profil fotoğrafı yüklenemedi."
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  // =====================================================
  // CV SEÇ
  // =====================================================

  const handleCVChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) return;

    // 10 MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error(
        "CV dosyası en fazla 10 MB olabilir."
      );

      e.target.value = "";
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      toast.error(
        "Sadece PDF dosyası yükleyebilirsiniz."
      );

      e.target.value = "";
      return;
    }

    setCv(file);
  };

  // =====================================================
  // CV YÜKLE
  // =====================================================

  const uploadCV = async () => {
    if (!cv) {
      toast.error("Lütfen bir PDF dosyası seçin.");
      return;
    }

    const formData = new FormData();

    formData.append("cv", cv);

    try {
      setUploadingCV(true);

      const res = await api.post(
        "/auth/upload-cv",
        formData
      );

      dispatch(
        loginSuccess({
          token,
          user: {
            ...user,
            cv: res.data.cv,
          },
        })
      );

      setCv(null);

      toast.success("CV başarıyla yüklendi.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "CV yüklenemedi."
      );
    } finally {
      setUploadingCV(false);
    }
  };

  // =====================================================
  // AVATAR URL
  // =====================================================

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `https://kariyerinsa-api.onrender.com${user.avatar}`
    : null;

  // =====================================================
  // CV URL
  // =====================================================

  const cvUrl = user?.cv
    ? user.cv.startsWith("http")
      ? user.cv
      : `https://kariyerinsa-api.onrender.com${user.cv}`
    : null;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Profilim
        </h1>

        <p className="text-gray-500 mt-2">
          Kişisel bilgilerinizi, profil fotoğrafınızı
          ve CV'nizi yönetin.
        </p>

      </div>

      <div className="space-y-8">

        {/* ================================================= */}
        {/* PROFİL BİLGİLERİ */}
        {/* ================================================= */}

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-6">
            Kişisel Bilgiler
          </h2>

          <form
            onSubmit={updateProfile}
            className="space-y-5"
          >

            {/* AD */}

            <div>

              <label className="block font-semibold mb-2">
                Ad Soyad
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ad Soyad"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            {/* TELEFON */}

            <div>

              <label className="block font-semibold mb-2">
                Telefon
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="05xx xxx xx xx"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* ŞEHİR */}

            <div>

              <label className="block font-semibold mb-2">
                Şehir
              </label>

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="İstanbul"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* GITHUB */}

            <div>

              <label className="block font-semibold mb-2">
                GitHub
              </label>

              <input
                name="github"
                value={form.github}
                onChange={handleChange}
                placeholder="https://github.com/kullanici"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* LINKEDIN */}

            <div>

              <label className="block font-semibold mb-2">
                LinkedIn
              </label>

              <input
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/kullanici"
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* BIO */}

            <div>

              <label className="block font-semibold mb-2">
                Hakkımda
              </label>

              <textarea
                name="bio"
                rows={6}
                value={form.bio}
                onChange={handleChange}
                placeholder="Kendiniz hakkında kısa bilgi..."
                className="w-full border rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* SAVE */}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold"
            >
              {loading
                ? "Kaydediliyor..."
                : "Profili Güncelle"}
            </button>

          </form>

        </div>

        {/* ================================================= */}
        {/* AVATAR */}
        {/* ================================================= */}

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-6">
            Profil Fotoğrafı
          </h2>

          <div className="flex flex-col md:flex-row gap-8 items-start">

            {/* CURRENT AVATAR */}

            <div>

              {avatarUrl ? (

                <img
                  src={avatarUrl}
                  alt="Profil"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                />

              ) : (

                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-50">

                  <span className="text-blue-600 text-4xl font-bold">
                    {user?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </span>

                </div>

              )}

            </div>

            {/* UPLOAD */}

            <div className="flex-1">

              <p className="text-gray-500 mb-4">
                JPG, PNG veya WEBP formatında
                maksimum 5 MB fotoğraf yükleyebilirsiniz.
              </p>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleAvatarChange}
                className="block w-full border rounded-xl p-3 mb-4"
              />

              {avatar && (

                <p className="text-sm text-gray-600 mb-4">
                  Seçilen dosya:{" "}
                  <strong>{avatar.name}</strong>
                </p>

              )}

              <button
                type="button"
                onClick={uploadAvatar}
                disabled={
                  uploadingAvatar || !avatar
                }
                className="bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl"
              >
                {uploadingAvatar
                  ? "Yükleniyor..."
                  : "Fotoğraf Yükle"}
              </button>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* CV */}
        {/* ================================================= */}

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-6">
            Özgeçmiş
          </h2>

          {/* CURRENT CV */}

          {cvUrl && (

            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                <div>

                  <p className="font-semibold text-green-800">
                    CV'niz mevcut
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    İşverenler başvurularınızda
                    CV'nizi görüntüleyebilir.
                  </p>

                </div>

                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg"
                >
                  CV'yi Görüntüle
                </a>

              </div>

            </div>

          )}

          <p className="text-gray-500 mb-4">
            Sadece PDF formatında, maksimum 10 MB
            boyutunda CV yükleyebilirsiniz.
          </p>

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleCVChange}
            className="block w-full border rounded-xl p-3 mb-4"
          />

          {cv && (

            <p className="text-sm text-gray-600 mb-4">
              Seçilen dosya:{" "}
              <strong>{cv.name}</strong>
            </p>

          )}

          <button
            type="button"
            onClick={uploadCV}
            disabled={uploadingCV || !cv}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl"
          >
            {uploadingCV
              ? "Yükleniyor..."
              : "CV Yükle"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default Profile;