import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const CreateJob = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    companyLogo: "",
    location: "",
    salary: "",
    category: "Yazılım",
    experience: "Junior",
    education: "",
    employmentType: "Full Time",
    deadline: "",
    description: "",
    requirements: "",
    skills: "",
    benefits: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createJob = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (form.deadline) {
        const deadline = new Date(form.deadline);

        if (deadline < today) {
          toast.error("Son başvuru tarihi geçmiş olamaz.");
          setLoading(false);
          return;
        }
      }
      if (!form.salary || Number(form.salary) <= 0) {
        toast.error("Maaş 0'dan büyük olmalıdır.");
        setLoading(false);
        return;
      }

      // Virgülle yazılan alanları array'e çeviriyoruz
      const jobData = {
        ...form,

        salary: Number(form.salary),

        skills: form.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        requirements: form.requirements
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        benefits: form.benefits
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await api.post("/jobs", jobData);

      toast.success("İlan başarıyla oluşturuldu.");

      navigate("/employer/jobs");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "İlan oluşturulamadı."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Yeni İş İlanı
      </h1>

      <form
        onSubmit={createJob}
        className="bg-white rounded-xl shadow p-8 space-y-6"
      >

        {/* İlan Başlığı */}

        <div>
          <label className="block font-semibold mb-2">
            İş Başlığı
          </label>

          <input
            type="text"
            name="title"
            placeholder="Örn: Junior React Developer"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Şirket */}

        <div>
          <label className="block font-semibold mb-2">
            Şirket Adı
          </label>

          <input
            type="text"
            name="company"
            placeholder="Şirket adı"
            value={form.company}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Şirket Logo */}

        <div>
          <label className="block font-semibold mb-2">
            Şirket Logo URL
          </label>

          <input
            type="text"
            name="companyLogo"
            placeholder="https://..."
            value={form.companyLogo}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Lokasyon + Maaş */}

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block font-semibold mb-2">
              Lokasyon
            </label>

            <input
              type="text"
              name="location"
              placeholder="İstanbul"
              value={form.location}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Maaş
            </label>

            <input
              type="number"
              name="salary"
              placeholder="50000"
              value={form.salary}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

        </div>

        {/* Kategori + Deneyim */}

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block font-semibold mb-2">
              Kategori
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option>Yazılım</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Full Stack</option>
              <option>Mobil</option>
              <option>DevOps</option>
              <option>Yapay Zeka</option>
              <option>Veri Bilimi</option>
              <option>Siber Güvenlik</option>
              <option>ERP</option>
              <option>Tasarım</option>
              <option>Pazarlama</option>
              <option>Muhasebe</option>
              <option>İnsan Kaynakları</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Deneyim
            </label>

            <select
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option>Junior</option>
              <option>Mid</option>
              <option>Senior</option>
            </select>
          </div>

        </div>

        {/* Çalışma Tipi + Eğitim */}

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block font-semibold mb-2">
              Çalışma Tipi
            </label>

            <select
              name="employmentType"
              value={form.employmentType}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Internship</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Eğitim
            </label>

            <input
              type="text"
              name="education"
              placeholder="Örn: Üniversite mezunu"
              value={form.education}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

        </div>

        {/* Son Başvuru Tarihi */}

        <div>
          <label className="block font-semibold mb-2">
            Son Başvuru Tarihi
          </label>

          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* İş Açıklaması */}

        <div>
          <label className="block font-semibold mb-2">
            İş Açıklaması
          </label>

          <textarea
            rows="7"
            name="description"
            placeholder="İş ilanının detaylarını yazın..."
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Yetenekler */}

        <div>
          <label className="block font-semibold mb-2">
            Yetenekler
          </label>

          <textarea
            rows="3"
            name="skills"
            placeholder="React, Node.js, MongoDB, Git"
            value={form.skills}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <p className="text-sm text-gray-500 mt-1">
            Yetenekleri virgülle ayırın.
          </p>
        </div>

        {/* Gereksinimler */}

        <div>
          <label className="block font-semibold mb-2">
            Aranan Nitelikler
          </label>

          <textarea
            rows="4"
            name="requirements"
            placeholder="JavaScript bilgisi, React deneyimi, Git bilgisi"
            value={form.requirements}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <p className="text-sm text-gray-500 mt-1">
            Nitelikleri virgülle ayırın.
          </p>
        </div>

        {/* Yan Haklar */}

        <div>
          <label className="block font-semibold mb-2">
            Yan Haklar
          </label>

          <textarea
            rows="4"
            name="benefits"
            placeholder="Yemek, yol, özel sağlık sigortası"
            value={form.benefits}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <p className="text-sm text-gray-500 mt-1">
            Yan hakları virgülle ayırın.
          </p>
        </div>

        {/* Buton */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg transition font-semibold"
        >
          {loading
            ? "Oluşturuluyor..."
            : "İlan Oluştur"}
        </button>

      </form>
    </div>
  );
};

export default CreateJob;