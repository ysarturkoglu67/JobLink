import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Briefcase,
  Users,
  Building2,
  FileText,
} from "lucide-react";

const Stats = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    totalEmployers: 0,
    totalApplications: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.get("/jobs/stats");

      setStats(res.data.stats);
    } catch (error) {
      console.error(
        "İstatistikler yüklenemedi:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Aktif İş İlanı",
      value: stats.totalJobs,
      icon: <Briefcase size={28} />,
    },
    {
      title: "Aday",
      value: stats.totalCandidates,
      icon: <Users size={28} />,
    },
    {
      title: "İşveren",
      value: stats.totalEmployers,
      icon: <Building2 size={28} />,
    },
    {
      title: "Toplam Başvuru",
      value: stats.totalApplications,
      icon: <FileText size={28} />,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

        {statsData.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl shadow p-6 flex items-center gap-4"
          >

            <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              {stat.icon}
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                {stat.title}
              </p>

              <h3 className="text-2xl font-bold">
                {loading
                  ? "..."
                  : stat.value.toLocaleString("tr-TR")}
              </h3>
            </div>

          </div>
        ))}

      </div>

    </section>
  );
};

export default Stats;