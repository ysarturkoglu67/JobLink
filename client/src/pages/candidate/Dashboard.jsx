import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);

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
    }
  };

  const pending = applications.filter(
    app => app.status === "Pending"
  ).length;

  const accepted = applications.filter(
    app => app.status === "Accepted"
  ).length;

  const rejected = applications.filter(
    app => app.status === "Rejected"
  ).length;

  return (
    <div className="space-y-8">

      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Toplam Başvuru
          </h3>

          <p className="text-4xl font-bold mt-2">
            {applications.length}
          </p>
        </div>

        <div className="bg-yellow-100 rounded-xl p-6">
          <h3>Bekleyen</h3>

          <p className="text-4xl font-bold">
            {pending}
          </p>
        </div>

        <div className="bg-green-100 rounded-xl p-6">
          <h3>Kabul</h3>

          <p className="text-4xl font-bold">
            {accepted}
          </p>
        </div>

        <div className="bg-red-100 rounded-xl p-6">
          <h3>Reddedilen</h3>

          <p className="text-4xl font-bold">
            {rejected}
          </p>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          Başvurduğum İlanlar
        </h2>

        {
          applications.map(app => (

            <div
              key={app._id}
              className="border-b py-4 flex justify-between items-center"
            >

              <div>

                <h3 className="font-semibold">

                  {app.job.title}

                </h3>

                <p className="text-gray-500">

                  {app.job.company}

                </p>

              </div>

              <span>

                {app.status}

              </span>

            </div>

          ))
        }

      </div>

    </div>
  );
};

export default Dashboard;