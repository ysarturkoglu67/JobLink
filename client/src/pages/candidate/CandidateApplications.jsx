import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Building2,
  CalendarDays,
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.get(
        "/applications/my-applications"
      );

      setApplications(
        res.data.applications || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Başvurular yüklenemedi."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case "Accepted":
        return {
          text: "Kabul Edildi",
          className:
            "bg-green-100 text-green-700",
        };

      case "Rejected":
        return {
          text: "Reddedildi",
          className:
            "bg-red-100 text-red-700",
        };

      default:
        return {
          text: "Bekliyor",
          className:
            "bg-yellow-100 text-yellow-700",
        };
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        Başvurular yükleniyor...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Başvurularım
          </h1>

          <p className="text-gray-500 mt-2">
            Yaptığınız iş başvurularını
            buradan takip edebilirsiniz.
          </p>
        </div>

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
          {applications.length} Başvuru
        </span>

      </div>

      {/* Boş */}

      {applications.length === 0 ? (

        <div className="bg-white rounded-2xl shadow p-12 text-center">

          <div className="text-5xl mb-5">
            📄
          </div>

          <h2 className="text-xl font-bold">
            Henüz başvurunuz yok
          </h2>

          <p className="text-gray-500 mt-2 mb-6">
            Size uygun iş ilanlarını keşfederek
            başvuru yapabilirsiniz.
          </p>

          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
          >
            İş İlanlarını Keşfet
          </Link>

        </div>

      ) : (

        <div className="space-y-5">

          {applications.map((application) => {

            const job = application.job;

            if (!job) return null;

            const status = getStatus(
              application.status
            );

            return (

              <div
                key={application._id}
                className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
              >

                <div className="flex flex-col md:flex-row md:justify-between gap-6">

                  {/* Sol */}

                  <div className="flex gap-5">

                    <img
                      src={
                        job.companyLogo ||
                        "https://placehold.co/80x80?text=Logo"
                      }
                      alt={job.company}
                      className="w-16 h-16 rounded-xl object-cover border"
                    />

                    <div>

                      <h2 className="text-xl font-bold">
                        {job.title}
                      </h2>

                      <p className="text-gray-500 flex items-center gap-2 mt-1">
                        <Building2 size={16} />
                        {job.company}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">

                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {job.location}
                        </span>

                        <span className="flex items-center gap-1">
                          <Briefcase size={16} />
                          {job.employmentType}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Durum */}

                  <div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${status.className}`}
                    >
                      {status.text}
                    </span>
                  </div>

                </div>

                {/* Ön Yazı */}

                {application.coverLetter && (

                  <div className="mt-6 bg-gray-50 rounded-xl p-4">

                    <h3 className="font-semibold mb-2">
                      Ön Yazı
                    </h3>

                    <p className="text-gray-600 whitespace-pre-line">
                      {application.coverLetter}
                    </p>

                  </div>

                )}

                {/* Tarih */}

                <div className="flex items-center gap-2 text-sm text-gray-500 mt-5">

                  <CalendarDays size={16} />

                  Başvuru tarihi:

                  {new Date(
                    application.createdAt
                  ).toLocaleDateString(
                    "tr-TR"
                  )}

                </div>

                {/* Butonlar */}

                <div className="flex flex-wrap gap-3 mt-6">

                  <Link
                    to={`/jobs/${job._id}`}
                    className="border border-gray-300 hover:bg-gray-100 px-5 py-2 rounded-lg transition"
                  >
                    İlanı Gör
                  </Link>

                  {application.status ===
                    "Accepted" && (

                    <Link
                      to="/candidate/interviews"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                    >
                      📅 Mülakatlarım
                    </Link>

                  )}

                </div>

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
};

export default CandidateApplications;