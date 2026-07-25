import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Briefcase,
  MapPin,
  Banknote,
} from "lucide-react";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.get("/applications/my-applications");

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

              <p className="text-gray-600 flex items-center gap-2 mt-2">
                <Briefcase size={18} />
                {app.job.company}
              </p>

              <p className="text-gray-600 flex items-center gap-2 mt-2">
                <MapPin size={18} />
                {app.job.location}
              </p>

              <p className="text-gray-600 flex items-center gap-2 mt-2">
                <Banknote size={18} />
                ₺ {app.job.salary}
              </p>

              <div className="mt-5">

                <span
                  className={`px-4 py-2 rounded-full text-white ${
                    app.status === "Pending"
                      ? "bg-yellow-500"
                      : app.status === "Accepted"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {app.status === "Pending"
                    ? "Beklemede"
                    : app.status === "Accepted"
                    ? "Kabul Edildi"
                    : "Reddedildi"}
                </span>

              </div>

              {app.job.createdBy && (
                <button
                  onClick={() =>
                    navigate(
                      `/candidate/chat/${app.job.createdBy._id}`
                    )
                  }
                  className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
                >
                  <MessageCircle size={18} />
                  İşverenle Mesajlaş
                </button>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default MyApplications;