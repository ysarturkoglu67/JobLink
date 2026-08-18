import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const EditJob = () => {
  const { id } = useParams();
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

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);

      const job = res.data.job;

      setForm({
        title: job.title || "",
        company: job.company || "",
        companyLogo: job.companyLogo || "",
        location: job.location || "",
        salary: job.salary || "",
        category: job.category || "Yazılım",
        experience: job.experience || "Junior",
        education: job.education || "",
        employmentType: job.employmentType || "Full Time",
        deadline: job.deadline
          ? job.deadline.substring(0, 10)
          : "",
        description: job.description || "",

        // Array → input için string
        requirements: Array.isArray(job.requirements)
          ? job.requirements.join(", ")
          : "",

        skills: Array.isArray(job.skills)
          ? job.skills.join(", ")
          : "",

        benefits: Array.isArray(job.benefits)
          ? job.benefits.join(", ")
          : "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "İlan bulunamadı."
      );
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateJob = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Maaş kontrolü
      if (!form.salary || Number(form.salary) <= 0) {
        toast.error("Maaş 0'dan büyük olmalıdır.");
        return;
      }

      // Son başvuru tarihi kontrolü
      if (form.deadline) {
        const deadline = new Date(form.deadline);
        deadline.setHours(23, 59, 59, 999);

        if (deadline < new Date()) {
          toast.error(
            "Son başvuru tarihi geçmiş olamaz."
          );
          return;
        }
      }

      // Zorunlu alan kontrolü
      if (
        !form.title.trim() ||
        !form.company.trim() ||
        !form.location.trim() ||
        !form.description.trim()
      ) {
        toast.error(
          "Lütfen zorunlu alanları doldurun."
        );
        return;
      }

      const jobData = {
        title: form.title.trim(),
        company: form.company.trim(),
        companyLogo: form.companyLogo.trim(),
        location: form.location.trim(),

        salary: Number(form.salary),

        category: form.category,
        experience: form.experience,
        education: form.education.trim(),
        employmentType: form.employmentType,

        deadline: form.deadline || null,

        description: form.description.trim(),

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

      await api.put(`/jobs/${id}`, jobData);

      toast.success("İlan güncellendi.");

      navigate("/employer/jobs");

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "İlan güncellenemedi."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        İlan Düzenle
      </h1>

      <form
        onSubmit={updateJob}
        className="bg-white rounded-xl shadow p-8 space-y-6"
      >

        {/* İş Başlığı */}

        <div>
          <label className="block font-semibold mb-2">
            İş Başlığı
          </label>

          <input
            type="text"
            name="title"
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
            value={form.company}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Logo */}

        <div>
          <label className="block font-semibold mb-2">
            Şirket Logo URL
          </label>

          <input
            type="text"
            name="companyLogo"
            value={form.companyLogo}
            onChange={handleChange}
            placeholder="https://..."
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
              value={form.education}
              onChange={handleChange}
              placeholder="Örn: Üniversite mezunu"
              className="w-full border rounded-lg p-3"
            />
          </div>

        </div>

        {/* Son Başvuru */}

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

        {/* Açıklama */}

        <div>
          <label className="block font-semibold mb-2">
            İş Açıklaması
          </label>

          <textarea
            rows="7"
            name="description"
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
            value={form.skills}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB, Git"
            className="w-full border rounded-lg p-3"
          />

          <p className="text-sm text-gray-500 mt-1">
            Virgülle ayırın.
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
            value={form.requirements}
            onChange={handleChange}
            placeholder="JavaScript bilgisi, React deneyimi, Git bilgisi"
            className="w-full border rounded-lg p-3"
          />

          <p className="text-sm text-gray-500 mt-1">
            Virgülle ayırın.
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
            value={form.benefits}
            onChange={handleChange}
            placeholder="Yemek, Yol, Özel Sağlık Sigortası"
            className="w-full border rounded-lg p-3"
          />

          <p className="text-sm text-gray-500 mt-1">
            Virgülle ayırın.
          </p>
        </div>

        {/* Güncelle */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Güncelleniyor..." : "İlanı Güncelle"}
        </button>

      </form>
    </div>
  );
};

export default EditJob;