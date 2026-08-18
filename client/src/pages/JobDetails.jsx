import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MapPin,
  Briefcase,
  Banknote,
  Clock3,
  Building2,
  GraduationCap,
  Eye,
  CalendarDays,
  CheckCircle,
  Gift,
  Heart,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { id } = useParams();

  const { user } = useSelector(
    (state) => state.auth
  );

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadJob();
  }, [id]);

  useEffect(() => {
    if (user) {
      checkSavedJob();
    } else {
      setIsSaved(false);
    }
  }, [user, id]);

  // =====================================================
  // İLANI GETİR
  // =====================================================

  const loadJob = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/jobs/${id}`);

      setJob(res.data.job);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "İlan bulunamadı."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FAVORİ DURUMUNU KONTROL ET
  // =====================================================

  const checkSavedJob = async () => {
    try {
      const res = await api.get(
        "/auth/saved-jobs"
      );

      const savedJobs = res.data.jobs || [];

      const saved = savedJobs.some(
        (savedJob) =>
          savedJob._id?.toString() ===
          id?.toString()
      );

      setIsSaved(saved);
    } catch (err) {
      console.log(
        "Favori durumu alınamadı:",
        err
      );
    }
  };

  // =====================================================
  // FAVORİ EKLE / ÇIKAR
  // =====================================================

  const toggleFavorite = async () => {
    if (!user) {
      toast.error(
        "Favorilere eklemek için giriş yapmalısınız."
      );

      return;
    }

    if (user.role !== "candidate") {
      toast.error(
        "Sadece adaylar ilanları favorilerine ekleyebilir."
      );

      return;
    }

    try {
      setSaving(true);

      const res = await api.post(
        "/auth/saved-jobs",
        {
          jobId: id,
        }
      );

      setIsSaved((prev) => !prev);

      toast.success(
        res.data.message ||
          (isSaved
            ? "Favorilerden kaldırıldı."
            : "Favorilere eklendi.")
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Favori işlemi başarısız."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // BAŞVURU
  // =====================================================

  const applyJob = async () => {
    if (!user) {
      toast.error(
        "Başvuru yapmak için giriş yapmalısınız."
      );

      return;
    }

    if (user.role !== "candidate") {
      toast.error(
        "Sadece adaylar iş ilanlarına başvurabilir."
      );

      return;
    }

    try {
      setApplying(true);

      await api.post("/applications", {
        jobId: job._id,
      });

      toast.success(
        "Başvurunuz başarıyla gönderildi."
      );

      // Başvuru sayısını güncelle
      setJob((prev) => ({
        ...prev,
        applicationCount:
          (prev.applicationCount || 0) + 1,
      }));
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Başvuru başarısız."
      );
    } finally {
      setApplying(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Yükleniyor...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20 text-xl">
        İlan bulunamadı.
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="max-w-5xl mx-auto py-10">

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* ================================================= */}
        {/* ÜST KISIM */}
        {/* ================================================= */}

        <div className="p-8">

          <div className="flex justify-between items-start flex-wrap gap-6">

            <div className="flex gap-5 items-start">

              {/* Logo */}

              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-20 h-20 rounded-xl object-cover border"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Building2
                    size={36}
                    className="text-gray-400"
                  />
                </div>
              )}

              <div>

                <h1 className="text-4xl font-bold">
                  {job.title}
                </h1>

                <p className="text-xl text-gray-600 mt-2 flex items-center gap-2">
                  <Building2 size={22} />
                  {job.company}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">

                  {job.category && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {job.category}
                    </span>
                  )}

                  {job.experience && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {job.experience}
                    </span>
                  )}

                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* BUTONLAR */}
            {/* ================================================= */}

            <div className="flex items-center gap-3">

              {/* Favori */}

              {user?.role === "candidate" && (
                <button
                  onClick={toggleFavorite}
                  disabled={saving}
                  title={
                    isSaved
                      ? "Favorilerden çıkar"
                      : "Favorilere ekle"
                  }
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition ${
                    isSaved
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-white border-gray-300 text-gray-500 hover:text-red-600 hover:border-red-300"
                  }`}
                >
                  <Heart
                    size={23}
                    fill={
                      isSaved
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              )}

              {/* Başvur */}

              <button
                onClick={applyJob}
                disabled={applying}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition"
              >
                {applying
                  ? "Başvuruluyor..."
                  : "Başvur"}
              </button>

            </div>

          </div>

          {/* ================================================= */}
          {/* İLAN BİLGİLERİ */}
          {/* ================================================= */}

          <div className="grid md:grid-cols-2 gap-5 mt-10">

            <Info
              icon={<MapPin />}
              text={job.location}
            />

            <Info
              icon={<Briefcase />}
              text={job.employmentType}
            />

            <Info
              icon={<Banknote />}
              text={`₺ ${Number(
                job.salary
              ).toLocaleString("tr-TR")}`}
            />

            <Info
              icon={<Clock3 />}
              text={`Yayınlanma: ${new Date(
                job.createdAt
              ).toLocaleDateString("tr-TR")}`}
            />

            {job.education && (
              <Info
                icon={<GraduationCap />}
                text={job.education}
              />
            )}

            {job.deadline && (
              <Info
                icon={<CalendarDays />}
                text={`Son başvuru: ${new Date(
                  job.deadline
                ).toLocaleDateString("tr-TR")}`}
              />
            )}

          </div>

          {/* ================================================= */}
          {/* İSTATİSTİKLER */}
          {/* ================================================= */}

          <div className="flex flex-wrap gap-6 mt-8 text-gray-500">

            <div className="flex items-center gap-2">
              <Eye size={18} />

              <span>
                {job.views || 0} görüntülenme
              </span>
            </div>

            {job.applicationCount !==
              undefined && (
              <div className="flex items-center gap-2">
                <Briefcase size={18} />

                <span>
                  {job.applicationCount} başvuru
                </span>
              </div>
            )}

          </div>

        </div>

        <hr />

        {/* ================================================= */}
        {/* İŞ AÇIKLAMASI */}
        {/* ================================================= */}

        <div className="p-8">

          <h2 className="text-2xl font-bold mb-4">
            İş Açıklaması
          </h2>

          <p className="text-gray-700 leading-8 whitespace-pre-line">
            {job.description}
          </p>

        </div>

        {/* ================================================= */}
        {/* YETENEKLER */}
        {/* ================================================= */}

        {Array.isArray(job.skills) &&
          job.skills.length > 0 && (
            <>
              <hr />

              <div className="p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Aranan Yetenekler
                </h2>

                <div className="flex flex-wrap gap-3">

                  {job.skills.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>
            </>
          )}

        {/* ================================================= */}
        {/* NİTELİKLER */}
        {/* ================================================= */}

        {Array.isArray(job.requirements) &&
          job.requirements.length > 0 && (
            <>
              <hr />

              <div className="p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Aranan Nitelikler
                </h2>

                <div className="space-y-3">

                  {job.requirements.map(
                    (
                      requirement,
                      index
                    ) => (
                      <div
                        key={index}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle
                          size={20}
                          className="text-green-600 mt-1 shrink-0"
                        />

                        <span className="text-gray-700">
                          {requirement}
                        </span>
                      </div>
                    )
                  )}

                </div>

              </div>
            </>
          )}

        {/* ================================================= */}
        {/* YAN HAKLAR */}
        {/* ================================================= */}

        {Array.isArray(job.benefits) &&
          job.benefits.length > 0 && (
            <>
              <hr />

              <div className="p-8">

                <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
                  <Gift />
                  Yan Haklar
                </h2>

                <div className="grid md:grid-cols-2 gap-3">

                  {job.benefits.map(
                    (
                      benefit,
                      index
                    ) => (
                      <div
                        key={index}
                        className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800"
                      >
                        {benefit}
                      </div>
                    )
                  )}

                </div>

              </div>
            </>
          )}

      </div>
    </div>
  );
};

// =====================================================
// INFO COMPONENT
// =====================================================

const Info = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-3 text-gray-700">

      <div className="text-blue-600">
        {icon}
      </div>

      <span>{text}</span>

    </div>
  );
};

export default JobDetails;