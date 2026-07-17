import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const jobId = searchParams.get("jobId");

  useEffect(() => {
    if (jobId) {
      loadApplicants();
    }
  }, [jobId]);

  const loadApplicants = async () => {
    try {
      const res = await api.get(`/applications/job/${jobId}`);

      setApplications(res.data.applications);
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
      await api.patch(`/applications/${id}/status`, {
        status,
      });

      toast.success("Başvuru güncellendi.");

      loadApplicants();
    } catch (err) {
      toast.error("Güncelleme başarısız.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold">
          Yükleniyor...
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Başvuranlar
      </h1>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          Henüz başvuru yapılmamış.
        </div>
      ) : (
        <div className="space-y-6">

          {applications.map((application) => (

            <div
              key={application._id}
              className="bg-white shadow rounded-xl p-6"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-xl font-bold">
                    {application.applicant.name}
                  </h2>

                  <p className="text-gray-500">
                    {application.applicant.email}
                  </p>

                  {application.coverLetter && (
                    <div className="mt-4">
                      <h3 className="font-semibold">
                        Ön Yazı
                      </h3>

                      <p className="text-gray-700 mt-2">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}

                </div>

                <div className="flex flex-col gap-3">

                  {application.applicant.cv && (
                    <a
                      href={`http://localhost:5000${application.applicant.cv}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
                    >
                      CV Görüntüle
                    </a>
                  )}

                  <button
                    onClick={() =>
                      updateStatus(
                        application._id,
                        "Accepted"
                      )
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Kabul Et
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        application._id,
                        "Rejected"
                      )
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Reddet
                  </button>

                </div>

              </div>

              <div className="mt-5">

                <span
                  className={`px-4 py-2 rounded-full text-white ${
                    application.status === "Pending"
                      ? "bg-yellow-500"
                      : application.status === "Accepted"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {application.status}
                </span>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default Applicants;