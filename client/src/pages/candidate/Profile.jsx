import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useRef } from "react";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    github: "",
    linkedin: "",
    bio: "",
  });
  const fileInput = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/auth/me");

      setForm({
        name: res.data.user.name || "",
        phone: res.data.user.phone || "",
        city: res.data.user.city || "",
        github: res.data.user.github || "",
        linkedin: res.data.user.linkedin || "",
        bio: res.data.user.bio || "",
      });
    } catch (error) {
      toast.error("Profil bilgileri yüklenemedi.");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put("/auth/profile", form);

      toast.success("Profil başarıyla güncellendi.");
    } catch (error) {
      toast.error("Profil güncellenemedi.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-8 mt-10">
      <h1 className="text-3xl font-bold mb-8">Profilim</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 font-medium">Ad Soyad</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Telefon</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Şehir</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">GitHub</label>
          <input
            type="text"
            name="github"
            value={form.github}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">LinkedIn</label>
          <input
            type="text"
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Hakkımda</label>
          <textarea
            rows="5"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Profili Güncelle
        </button>
      </form>
    </div>
  );
};

export default Profile;