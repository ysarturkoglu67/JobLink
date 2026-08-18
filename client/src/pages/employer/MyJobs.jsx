import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);

      const res = await api.get("/jobs/my-jobs");

      setJobs(res.data.jobs);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "İlanlar alınamadı."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Bu ilanı silmek istediğinize emin misiniz?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/jobs/${id}`);

      toast.success("İlan silindi.");

      loadJobs();

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Silme işlemi başarısız."
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl font-semibold">
        Yükleniyor...
      </div>
    );
  }
  const toggleJobStatus = async (id) => {
    try {
      const res = await api.patch(
        `/jobs/${id}/status`
      );

      toast.success(res.data.message);

      setJobs((prev) =>
        prev.map((job) =>
          job._id === id
            ? {
              ...job,
              isActive: res.data.job.isActive,
            }
            : job
        )
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "İlan durumu değiştirilemedi."
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          İlanlarım
        </h1>

        <button
          onClick={() => navigate("/employer/create-job")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          Yeni İlan Oluştur
        </button>

      </div>

      {jobs.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-8 text-center">
          Henüz ilan oluşturmadınız.
        </div>
      ) : (
        <div className="space-y-5">

          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold">
                {job.title}
              </h2>

              <p className="text-gray-500 mt-1">
                {job.company}
              </p>

              <div className="flex gap-5 mt-4 text-sm text-gray-600">
                <span>📍 {job.location}</span>
                <span>💰 {job.salary} ₺</span>
                <span>💼 {job.employmentType}</span>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() =>
                    toggleJobStatus(job._id)
                  }
                  className={
                    job.isActive
                      ? "bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                      : "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  }
                >
                  {job.isActive
                    ? "Pasif Yap"
                    : "Aktif Et"}
                </button>
                <button
                  onClick={() =>
                    navigate(`/employer/edit-job/${job._id}`)
                  }
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                >
                  Düzenle
                </button>

                <button
                  onClick={() => deleteJob(job._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Sil
                </button>

                <button
                  onClick={() =>
                    navigate(`/employer/applicants?jobId=${job._id}`)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Başvuranlar
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default MyJobs;