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
    location: "",
    employmentType: "",
    salary: "",
    description: "",
  });

  useEffect(() => {
    loadJob();
  }, []);

  const loadJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);

      setForm({
        title: res.data.job.title,
        company: res.data.job.company,
        location: res.data.job.location,
        employmentType: res.data.job.employmentType,
        salary: res.data.job.salary,
        description: res.data.job.description,
      });
    } catch (err) {
      toast.error("İlan bulunamadı.");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateJob = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/jobs/${id}`, form);

      toast.success("İlan güncellendi.");

      navigate("/employer/jobs");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Güncellenemedi."
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">

      <h1 className="text-3xl font-bold mb-8">
        İlan Düzenle
      </h1>

      <form
        onSubmit={updateJob}
        className="space-y-5"
      >

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded p-3"
        />

        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          className="w-full border rounded p-3"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full border rounded p-3"
        />

        <select
          name="employmentType"
          value={form.employmentType}
          onChange={handleChange}
          className="w-full border rounded p-3"
        >
          <option>Full Time</option>
          <option>Part Time</option>
          <option>Remote</option>
          <option>Hybrid</option>
        </select>

        <input
          type="number"
          name="salary"
          value={form.salary}
          onChange={handleChange}
          className="w-full border rounded p-3"
        />

        <textarea
          rows="6"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded p-3"
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded">
          Güncelle
        </button>

      </form>

    </div>
  );
};

export default EditJob;