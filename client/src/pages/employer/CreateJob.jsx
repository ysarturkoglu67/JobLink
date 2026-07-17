import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const CreateJob = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    employmentType: "Full Time",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createJob = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/jobs", form);

      toast.success("İlan başarıyla oluşturuldu.");

      navigate("/employer/jobs");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "İlan oluşturulamadı."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-8">

      <h1 className="text-3xl font-bold mb-8">
        Yeni İş İlanı
      </h1>

      <form onSubmit={createJob} className="space-y-5">

        <input
          type="text"
          name="title"
          placeholder="İş Başlığı"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Şirket"
          value={form.company}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Lokasyon"
          value={form.location}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          type="number"
          name="salary"
          placeholder="Maaş"
          value={form.salary}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

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
        </select>

        <textarea
          rows="6"
          name="description"
          placeholder="İş Açıklaması"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
        >
          {loading ? "Oluşturuluyor..." : "İlan Oluştur"}
        </button>

      </form>
    </div>
  );
};

export default CreateJob;