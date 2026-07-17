import { useEffect, useState } from "react";
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
      const res = await api.get("/applications/my-applications");

      setApplications(res.data.applications);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Başvurular yüklenemedi."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold">
          Yükleniyor...
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Başvurularım
      </h1>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          Henüz başvuru yapmadınız.
        </div>
      ) : (
        <div className="space-y-5">

          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-xl shadow p-6"
            >
              <h2 className="text-2xl font-bold">
                {app.job.title}
              </h2>

              <p className="text-gray-500 mt-2">
                {app.job.company}
              </p>

              <p className="mt-2">
                📍 {app.job.location}
              </p>

              <p className="mt-2">
                💰 {app.job.salary} ₺
              </p>

              <div className="mt-4">

                <span
                  className={`px-4 py-2 rounded-full text-white ${
                    app.status === "Pending"
                      ? "bg-yellow-500"
                      : app.status === "Accepted"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {app.status}
                </span>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default MyApplications;