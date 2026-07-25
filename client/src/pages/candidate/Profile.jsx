import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { loginSuccess } from "../../redux/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
    bio: user?.bio || "",
  });

  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.put(
        "/auth/profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(
        loginSuccess({
          token,
          user: res.data.user,
        })
      );

      toast.success("Profil güncellendi.");

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Profil güncellenemedi."
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadResume = async () => {
    if (!resume) {
      return toast.error("Lütfen PDF seçin.");
    }

    const formData = new FormData();

    formData.append("resume", resume);

    try {
      setUploading(true);

      const res = await api.post(
        "/auth/upload-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(
        loginSuccess({
          token,
          user: {
            ...user,
            resume: res.data.resume,
          },
        })
      );

      toast.success("CV başarıyla yüklendi.");

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "CV yüklenemedi."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">

      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          Profilim
        </h1>

        <form
          onSubmit={updateProfile}
          className="space-y-5"
        >

          <input
            name="name"
            placeholder="Ad Soyad"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <input
            name="phone"
            placeholder="Telefon"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <input
            name="city"
            placeholder="Şehir"
            value={form.city}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <input
            name="github"
            placeholder="Github"
            value={form.github}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <input
            name="linkedin"
            placeholder="LinkedIn"
            value={form.linkedin}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <textarea
            name="bio"
            placeholder="Hakkımda"
            rows={5}
            value={form.bio}
            onChange={handleChange}
            className="w-full border rounded-xl p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            {loading
              ? "Kaydediliyor..."
              : "Profili Güncelle"}
          </button>

        </form>

        <div className="border-t mt-10 pt-8">
         <input
    type="file"
    accept="image/*"
/>

<button>
    Fotoğraf Yükle
   </button>
          <h2 className="text-2xl font-bold mb-5">
            Özgeçmiş (PDF)
          </h2>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setResume(e.target.files[0])
            }
            className="mb-4"
          />

          <button
            onClick={uploadResume}
            disabled={uploading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
          >
            {uploading
              ? "Yükleniyor..."
              : "CV Yükle"}
          </button>

          {user?.resume && (
            <a
              href={`http://localhost:5000/uploads/cv/${user.resume}`}
              target="_blank"
              rel="noreferrer"
              className="block mt-5 text-blue-600 hover:underline"
            >
              📄 CV'yi Görüntüle
            </a>
          )}

        </div>

      </div>

    </div>
  );
};

export default Profile;