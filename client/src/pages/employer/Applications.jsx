import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const Applications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, [jobId]);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/applications/job/${jobId}`
      );

      setApplications(
        res.data.applications || []
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Başvurular yüklenemedi."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(
        `/applications/${id}/status`,
        {
          status,
        }
      );

      toast.success(
        status === "Accepted"
          ? "Başvuru kabul edildi."
          : "Başvuru reddedildi."
      );

      loadApplications();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "İşlem başarısız."
      );
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

      case "Pending":
        return {
          text: "Bekliyor",
          className:
            "bg-yellow-100 text-yellow-700",
        };

      default:
        return {
          text: status,
          className:
            "bg-gray-100 text-gray-700",
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

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Başvurular
          </h1>

          <p className="text-gray-500 mt-2">
            İlanınıza yapılan başvuruları
            yönetin.
          </p>
        </div>

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
          {applications.length} Başvuru
        </span>

      </div>

      {applications.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
          Bu ilana henüz başvuru yapılmamış.
        </div>

      ) : (

        <div className="space-y-6">

          {applications.map((app) => {

            const status = getStatus(
              app.status
            );

            return (
              <div
                key={app._id}
                className="bg-white shadow rounded-xl p-6"
              >

                {/* Üst Bilgi */}

                <div className="flex flex-col md:flex-row md:justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">

                      {app.applicant?.avatar ? (
                        <img
                          src={
                            app.applicant.avatar.startsWith(
                              "http"
                            )
                              ? app.applicant.avatar
                              : `http://localhost:5000${app.applicant.avatar}`
                          }
                          alt={
                            app.applicant.name
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-blue-600 font-bold text-xl">
                          {app.applicant?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}
                        </span>
                      )}

                    </div>

                    <div>

                      <h2 className="text-xl font-bold">
                        {app.applicant?.name}
                      </h2>

                      <p className="text-gray-500">
                        {app.applicant?.email}
                      </p>

                      {app.applicant?.phone && (
                        <p className="text-gray-500">
                          {app.applicant.phone}
                        </p>
                      )}

                    </div>

                  </div>

                  <span
                    className={`h-fit px-4 py-2 rounded-full font-semibold text-sm ${status.className}`}
                  >
                    {status.text}
                  </span>

                </div>

                {/* Ön Yazı */}

                <div className="mt-6 bg-gray-50 rounded-lg p-5">

                  <h3 className="font-semibold">
                    Ön Yazı
                  </h3>

                  <p className="mt-2 text-gray-700 whitespace-pre-line">
                    {app.coverLetter ||
                      "Ön yazı bulunmuyor."}
                  </p>

                </div>

                {/* İşlemler */}

                <div className="flex flex-wrap gap-3 mt-6">

                  {app.status ===
                    "Pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(
                            app._id,
                            "Accepted"
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
                      >
                        ✓ Kabul Et
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            app._id,
                            "Rejected"
                          )
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
                      >
                        ✕ Reddet
                      </button>
                    </>
                  )}

                  {app.status ===
                    "Accepted" && (
                    <button
                      onClick={() =>
                        navigate(
                          `/employer/interviews/schedule/${app._id}`
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                    >
                      📅 Mülakat Planla
                    </button>
                  )}

                  {app.status ===
                    "Rejected" && (
                    <span className="text-red-600 font-medium py-2">
                      Bu başvuru reddedildi.
                    </span>
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

export default Applications;