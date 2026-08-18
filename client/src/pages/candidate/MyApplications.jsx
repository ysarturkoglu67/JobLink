import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  CalendarDays,
  Building2,
  Clock,
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const MyApplications = () => {
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
    if (status === "Accepted") {
      return {
        text: "Kabul Edildi",
        className:
          "bg-green-100 text-green-700",
      };
    }

    if (status === "Rejected") {
      return {
        text: "Reddedildi",
        className:
          "bg-red-100 text-red-700",
      };
    }

    return {
      text: "Beklemede",
      className:
        "bg-yellow-100 text-yellow-700",
    };
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12">

        <h1 className="text-3xl font-bold mb-8">
          Başvurularım
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
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>

                </div>
              </div>
            )
          )}

        </div>

      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Başvurularım
          </h1>

          <p className="text-gray-500 mt-2">
            Gönderdiğiniz iş başvurularını
            buradan takip edebilirsiniz.
          </p>
        </div>

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
          {applications.length} Başvuru
        </span>

      </div>

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
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            İş İlanlarını Gör
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

                  <div className="flex flex-col items-start md:items-end gap-3">

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${status.className}`}
                    >
                      {status.text}
                    </span>

                    <span className="text-gray-500 text-sm flex items-center gap-1">
                      <CalendarDays size={16} />

                      {new Date(
                        application.createdAt
                      ).toLocaleDateString(
                        "tr-TR"
                      )}
                    </span>

                  </div>

                </div>

                {application.coverLetter && (
                  <div className="mt-6 pt-5 border-t">

                    <h3 className="font-semibold mb-2">
                      Ön Yazınız
                    </h3>

                    <p className="text-gray-600 whitespace-pre-line">
                      {application.coverLetter}
                    </p>

                  </div>
                )}

                <div className="mt-6 pt-5 border-t flex justify-end">

                  <Link
                    to={`/jobs/${job._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition"
                  >
                    İlanı Görüntüle
                  </Link>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default MyApplications;