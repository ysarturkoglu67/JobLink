import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Banknote,
  Clock3,
  Building2,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    loadJob();
  }, []);

  const loadJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data.job);
    } catch (err) {
      toast.error("İlan bulunamadı.");
    } finally {
      setLoading(false);
    }
  };

  const applyJob = async () => {
    try {
      setApplying(true);

      await api.post("/applications", {
        jobId: job._id,
      });

      toast.success("Başvurunuz başarıyla gönderildi.");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Başvuru başarısız."
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Yükleniyor...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20 text-red-500 text-xl">
        İlan bulunamadı.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <div className="bg-white rounded-2xl shadow-lg p-8">

        <div className="flex justify-between items-start flex-wrap gap-6">

          <div>

            <h1 className="text-4xl font-bold">
              {job.title}
            </h1>

            <p className="text-xl text-gray-600 mt-2 flex items-center gap-2">
              <Building2 size={22} />
              {job.company}
            </p>

          </div>

          <button
            onClick={applyJob}
            disabled={applying}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
          >
            {applying ? "Başvuruluyor..." : "Başvur"}
          </button>

        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-10">

          <div className="flex items-center gap-3">
            <MapPin />
            <span>{job.location}</span>
          </div>

          <div className="flex items-center gap-3">
            <Briefcase />
            <span>{job.employmentType}</span>
          </div>

          <div className="flex items-center gap-3">
            <Banknote />
            <span>₺ {job.salary}</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock3 />
            <span>
              {new Date(job.createdAt).toLocaleDateString("tr-TR")}
            </span>
          </div>

        </div>

        <hr className="my-10" />

        <h2 className="text-2xl font-bold mb-4">
          İş Açıklaması
        </h2>

        <p className="text-gray-700 leading-8 whitespace-pre-line">
          {job.description}
        </p>

        {job.requirements && (
          <>
            <hr className="my-10" />

            <h2 className="text-2xl font-bold mb-4">
              Aranan Nitelikler
            </h2>

            <p className="text-gray-700 leading-8 whitespace-pre-line">
              {job.requirements}
            </p>
          </>
        )}

      </div>

    </div>
  );
};

export default JobDetails;