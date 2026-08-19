import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Users,
  Briefcase,
  FileText,
  Building2,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const dashboardRes = await api.get("/admin/dashboard");
      const chartsRes = await api.get("/admin/charts");

      setStats(dashboardRes.data.stats);
      setRecentUsers(dashboardRes.data.recentUsers || []);
      setRecentJobs(dashboardRes.data.recentJobs || []);
      setRecentApplications(
        dashboardRes.data.recentApplications || []
      );

      setChartData([
        {
          name: "Aday",
          value:
            chartsRes.data.usersByRole.find(
              (x) => x._id === "candidate"
            )?.total || 0,
        },
        {
          name: "İşveren",
          value:
            chartsRes.data.usersByRole.find(
              (x) => x._id === "employer"
            )?.total || 0,
        },
        {
          name: "İlan",
          value: dashboardRes.data.stats.totalJobs,
        },
        {
          name: "Başvuru",
          value: dashboardRes.data.stats.totalApplications,
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Dashboard yükleniyor...
      </div>
    );
  }

  return (
    <div className="space-y-10">

      <div>
        <h1 className="text-4xl font-bold">
          Admin Paneli
        </h1>

        <p className="text-gray-500 mt-2">
          Kariyerİnşa.com sistemini buradan yönetebilirsin.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition">
          <Users className="text-blue-600 mb-3" size={30} />
          <h2 className="text-gray-500">Kullanıcı</h2>
          <p className="text-4xl font-bold">
            {stats.totalUsers}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition">
          <Building2 className="text-green-600 mb-3" size={30} />
          <h2 className="text-gray-500">İşveren</h2>
          <p className="text-4xl font-bold">
            {stats.employers}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition">
          <Users className="text-purple-600 mb-3" size={30} />
          <h2 className="text-gray-500">Aday</h2>
          <p className="text-4xl font-bold">
            {stats.candidates}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition">
          <Briefcase className="text-orange-600 mb-3" size={30} />
          <h2 className="text-gray-500">İlan</h2>
          <p className="text-4xl font-bold">
            {stats.totalJobs}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition">
          <FileText className="text-red-600 mb-3" size={30} />
          <h2 className="text-gray-500">Başvuru</h2>
          <p className="text-4xl font-bold">
            {stats.totalApplications}
          </p>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-5">
          Sistem İstatistikleri
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-5">
            Son Eklenen Kullanıcılar
          </h2>

          {recentUsers.length === 0 ? (
            <p className="text-gray-500">
              Henüz kullanıcı bulunmuyor.
            </p>
          ) : (
            <div className="space-y-4">

              {recentUsers.map((user) => (

                <div
                  key={user._id}
                  className="flex justify-between items-center border-b pb-3"
                >

                  <div>
                    <h3 className="font-semibold">
                      {user.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {user.email}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-700"
                        : user.role === "employer"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>

                </div>

              ))}

            </div>
          )}

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-5">
            Son Eklenen İlanlar
          </h2>

          {recentJobs.length === 0 ? (
            <p className="text-gray-500">
              Henüz ilan bulunmuyor.
            </p>
          ) : (
            <div className="space-y-4">

              {recentJobs.map((job) => (

                <div
                  key={job._id}
                  className="flex justify-between items-center border-b pb-3"
                >

                  <div>

                    <h3 className="font-semibold">
                      {job.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {job.company}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(job.createdAt).toLocaleDateString("tr-TR")}
                    </p>

                  </div>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {job.location}
                  </span>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>
            {/* Son Başvurular */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-5">
          Son Başvurular
        </h2>

        {recentApplications.length === 0 ? (

          <p className="text-gray-500">
            Henüz başvuru bulunmuyor.
          </p>

        ) : (

          <div className="space-y-4">

            {recentApplications.map((app) => (

              <div
                key={app._id}
                className="flex justify-between items-center border-b pb-3"
              >

                <div>

                  <h3 className="font-semibold">
                    {app.applicant.name}
                  </h3>

                  <p className="text-gray-500">
                    {app.job.title}
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(app.createdAt).toLocaleDateString("tr-TR")}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    app.status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : app.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {app.status === "Accepted"
                    ? "Kabul"
                    : app.status === "Rejected"
                    ? "Reddedildi"
                    : "Beklemede"}
                </span>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default Dashboard;