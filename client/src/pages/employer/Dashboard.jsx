import { useEffect, useState } from "react";
import api from "../../api/axios";

const Dashboard = () => {

  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {

    const res = await api.get("/employer/dashboard");

    setStats(res.data.stats);

  };

  if (!stats) {

    return (
      <div className="text-center py-20">
        Yükleniyor...
      </div>
    );

  }

  return (

    <div>

      <h1 className="text-3xl font-bold mb-8">
        Employer Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h2>İlanlarım</h2>
          <p className="text-4xl font-bold">
            {stats.totalJobs}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2>Toplam Başvuru</h2>
          <p className="text-4xl font-bold">
            {stats.totalApplications}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2>Kabul</h2>
          <p className="text-4xl font-bold text-green-600">
            {stats.acceptedApplications}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2>Bekleyen</h2>
          <p className="text-4xl font-bold text-yellow-600">
            {stats.pendingApplications}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2>Reddedilen</h2>
          <p className="text-4xl font-bold text-red-600">
            {stats.rejectedApplications}
          </p>
        </div>

      </div>

    </div>

  );
};

export default Dashboard;