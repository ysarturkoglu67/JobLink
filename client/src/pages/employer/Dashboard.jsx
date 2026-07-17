import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.get("/jobs/stats");

      setStats(res.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Veriler alınamadı."
      );
    }
  };

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        Employer Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-gray-500">
            Toplam İlan
          </h3>

          <p className="text-5xl font-bold mt-3">
            {stats.totalJobs}
          </p>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;