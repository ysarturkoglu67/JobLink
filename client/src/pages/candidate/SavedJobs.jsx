import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Banknote,
  Trash2,
  Building2,
  Eye,
  Clock,
} from "lucide-react";

import api from "../../api/axios";
import toast from "react-hot-toast";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  // =====================================================
  // FAVORİLERİ GETİR
  // =====================================================

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      setLoading(true);

      const res = await api.get("/saved-jobs");

      setSavedJobs(res.data.savedJobs || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Favoriler yüklenemedi."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FAVORİDEN ÇIKAR
  // =====================================================

  const removeJob = async (jobId) => {
    try {
      setRemovingId(jobId);

      await api.delete(`/saved-jobs/${jobId}`);

      setSavedJobs((prev) =>
        prev.filter(
          (item) => item.job?._id !== jobId
        )
      );

      toast.success(
        "İlan favorilerden çıkarıldı."
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "İlan favorilerden çıkarılamadı."
      );
    } finally {
      setRemovingId(null);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-6">

        <h1 className="text-3xl font-bold mb-8">
          Favorilerim
        </h1>

        <div className="space-y-5">

          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow p-6 animate-pulse"
              >
                <div className="flex gap-4">

                  <div className="w-16 h-16 bg-gray-200 rounded-xl" />

                  <div className="flex-1">

                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-3" />

                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />

                    <div className="h-3 bg-gray-200 rounded w-1/4" />

                  </div>

                </div>
              </div>
            )
          )}

        </div>

      </div>
    );
  }

  // =====================================================
  // SAYFA
  // =====================================================

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold">
            Favorilerim
          </h1>

          <p className="text-gray-500 mt-2">
            Kaydettiğiniz iş ilanlarını buradan
            takip edebilirsiniz.
          </p>

        </div>

        <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold w-fit">
          {savedJobs.length} İlan
        </span>

      </div>

      {/* EMPTY */}

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">

          <div className="text-5xl mb-5">
            ❤️
          </div>

          <h2 className="text-xl font-bold">
            Henüz favori ilanınız yok
          </h2>

          <p className="text-gray-500 mt-2 mb-6">
            Beğendiğiniz ilanları favorilerinize
            ekleyebilirsiniz.
          </p>

          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            İlanları Keşfet
          </Link>

        </div>
      ) : (

        <div className="space-y-5">

          {savedJobs.map((saved) => {

            const job = saved.job;

            // İlan silinmişse
            if (!job) {
              return (
                <div
                  key={saved._id}
                  className="bg-white rounded-2xl shadow p-6"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Briefcase
                        size={25}
                        className="text-gray-400"
                      />
                    </div>

                    <div className="flex-1">

                      <h2 className="font-semibold">
                        İlan artık mevcut değil
                      </h2>

                      <p className="text-gray-500 text-sm mt-1">
                        Bu ilan silinmiş olabilir.
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        removeJob(saved.job?._id)
                      }
                      className="text-red-600"
                    >
                      <Trash2 size={20} />
                    </button>

                  </div>

                </div>
              );
            }

            const deadlinePassed =
              job.deadline &&
              new Date(job.deadline) <
                new Date();

            const isRemoving =
              removingId === job._id;

            return (
              <div
                key={saved._id}
                className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
              >

                {/* İLAN BİLGİLERİ */}

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  <div className="flex gap-5">

                    {/* LOGO */}

                    <img
                      src={
                        job.companyLogo ||
                        "https://placehold.co/80x80?text=Logo"
                      }
                      alt={job.company}
                      className="w-16 h-16 rounded-xl object-cover border shrink-0"
                    />

                    <div>

                      <h2 className="text-xl font-bold">
                        {job.title}
                      </h2>

                      <p className="text-gray-500 flex items-center gap-2 mt-1">
                        <Building2 size={16} />
                        {job.company}
                      </p>

                      {/* BİLGİLER */}

                      <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">

                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {job.location}
                        </span>

                        <span className="flex items-center gap-1">
                          <Briefcase size={16} />
                          {job.employmentType}
                        </span>

                        {job.salary && (
                          <span className="flex items-center gap-1">
                            <Banknote size={16} />
                            ₺{" "}
                            {Number(
                              job.salary
                            ).toLocaleString(
                              "tr-TR"
                            )}
                          </span>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* DURUM */}

                  <div className="flex flex-col lg:items-end gap-2">

                    {!job.isActive ? (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-sm font-semibold">
                        İlan pasif
                      </span>
                    ) : deadlinePassed ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1.5 rounded-full text-sm font-semibold">
                        Başvuru süresi doldu
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                        Aktif
                      </span>
                    )}

                    {job.deadline && (
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={15} />

                        Son başvuru:{" "}
                        {new Date(
                          job.deadline
                        ).toLocaleDateString(
                          "tr-TR"
                        )}
                      </span>
                    )}

                  </div>

                </div>

                {/* BUTONLAR */}

                <div className="mt-6 pt-5 border-t flex flex-wrap gap-3">

                  <Link
                    to={`/jobs/${job._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2"
                  >
                    <Eye size={18} />
                    Detay
                  </Link>

                  <button
                    disabled={isRemoving}
                    onClick={() =>
                      removeJob(job._id)
                    }
                    className="border border-red-200 text-red-600 hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 px-4 py-2.5 rounded-lg flex items-center gap-2"
                  >
                    <Trash2 size={18} />

                    {isRemoving
                      ? "Kaldırılıyor..."
                      : "Favoriden Kaldır"}
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default SavedJobs;