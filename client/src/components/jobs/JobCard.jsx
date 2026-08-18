import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MapPin,
  Briefcase,
  Banknote,
  Clock3,
  Heart,
  Eye,
  Layers3,
  GraduationCap,
} from "lucide-react";

import api from "../../api/axios";
import toast from "react-hot-toast";

const JobCard = ({ job }) => {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // İlanın daha önceden favoride olup olmadığını kontrol et
  useEffect(() => {
    const checkSaved = async () => {
      try {
        const res = await api.get(
          `/saved-jobs/check/${job._id}`
        );

        setSaved(res.data.saved);
      } catch (error) {
        // Kullanıcı giriş yapmamışsa sessiz geç
        setSaved(false);
      }
    };

    checkSaved();
  }, [job._id]);

  // Favori ekle / çıkar
  const toggleSaveJob = async () => {
    if (saving) return;

    try {
      setSaving(true);

      if (saved) {
        // Favoriden çıkar
        await api.delete(
          `/saved-jobs/${job._id}`
        );

        setSaved(false);

        toast.success(
          "İlan favorilerden çıkarıldı."
        );
      } else {
        // Favoriye ekle
        await api.post("/saved-jobs", {
          jobId: job._id,
        });

        setSaved(true);

        toast.success(
          "İlan favorilere eklendi."
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Favori işlemi başarısız."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`relative bg-white rounded-2xl border p-6 shadow-sm hover:shadow-lg transition ${
        !job.isActive ? "opacity-70" : ""
      }`}
    >

      {/* Favori */}

      <button
        type="button"
        onClick={toggleSaveJob}
        disabled={saving}
        className="absolute top-5 right-5 disabled:opacity-50"
        title={
          saved
            ? "Favorilerden çıkar"
            : "Favorilere ekle"
        }
      >
        <Heart
          size={22}
          className={`transition ${
            saved
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>

      {/* Logo + Başlık */}

      <div className="flex gap-4 pr-10">

        <img
          src={
            job.companyLogo ||
            "https://placehold.co/80x80?text=Logo"
          }
          alt={job.company}
          className="w-16 h-16 rounded-xl object-cover border"
        />

        <div>

          <h2 className="text-2xl font-bold text-gray-900">
            {job.title}
          </h2>

          <p className="text-gray-500 mt-1">
            {job.company}
          </p>

          {!job.isActive && (
            <span className="inline-block mt-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
              Pasif İlan
            </span>
          )}

        </div>

      </div>

      {/* Bilgiler */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 text-gray-700">

        <div className="flex items-center gap-2">
          <MapPin
            size={18}
            className="text-gray-500"
          />
          <span>{job.location}</span>
        </div>

        <div className="flex items-center gap-2">
          <Briefcase
            size={18}
            className="text-gray-500"
          />
          <span>{job.employmentType}</span>
        </div>

        <div className="flex items-center gap-2">
          <Banknote
            size={18}
            className="text-gray-500"
          />
          <span>
            ₺{" "}
            {job.salary
              ? Number(job.salary).toLocaleString(
                  "tr-TR"
                )
              : "Belirtilmemiş"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock3
            size={18}
            className="text-gray-500"
          />
          <span>
            {new Date(
              job.createdAt
            ).toLocaleDateString("tr-TR")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Layers3
            size={18}
            className="text-gray-500"
          />
          <span>{job.category}</span>
        </div>

        <div className="flex items-center gap-2">
          <GraduationCap
            size={18}
            className="text-gray-500"
          />
          <span>{job.experience}</span>
        </div>

      </div>

      {/* Yetenekler */}

      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">

          {job.skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}

        </div>
      )}

      {/* Alt bölüm */}

      <div className="flex justify-between items-center mt-8 gap-4">

        <div className="flex items-center gap-2 text-gray-500">

          <Eye size={18} />

          <span>
            {job.views || 0} görüntülenme
          </span>

        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
        >
          Detayları Gör
        </Link>

      </div>

    </div>
  );
};

export default JobCard;