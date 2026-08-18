import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/axios";
import toast from "react-hot-toast";

import {
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Plus,
  ArrowRight,
  FileText,
} from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // DASHBOARD VERİLERİ
  // =====================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // Backend'de mevcut endpoint
      const res = await api.get(
        "/jobs/employer/stats"
      );

      setData(res.data);

    } catch (err) {
      console.error(
        "EMPLOYER DASHBOARD ERROR:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Dashboard verileri yüklenemedi."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">

        <div>
          <div className="h-9 bg-gray-200 rounded w-64" />

          <div className="h-4 bg-gray-200 rounded w-96 mt-3" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">

          {Array.from({ length: 5 }).map(
            (_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow h-32"
              />
            )
          )}

        </div>

        <div className="grid md:grid-cols-3 gap-4">

          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow h-20"
              />
            )
          )}

        </div>

        <div className="bg-white rounded-2xl shadow h-96" />

      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const {
    totalJobs = 0,
    totalApplications = 0,
    pending = 0,
    accepted = 0,
    rejected = 0,
    totalViews = 0,
    latestJobs = [],
  } = data || {};

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-8">

      {/* =================================================
          BAŞLIK
      ================================================= */}

      <div>

        <h1 className="text-3xl font-bold">
          İşveren Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          İlanlarınızı ve başvurularınızı
          buradan takip edebilirsiniz.
        </p>

      </div>

      {/* =================================================
          İSTATİSTİKLER
      ================================================= */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">

        {/* İLAN */}

        <StatCard
          title="İlanlarım"
          value={totalJobs}
          icon={
            <Briefcase size={26} />
          }
          iconClass="bg-blue-100 text-blue-600"
        />

        {/* BAŞVURU */}

        <StatCard
          title="Toplam Başvuru"
          value={totalApplications}
          icon={
            <Users size={26} />
          }
          iconClass="bg-purple-100 text-purple-600"
        />

        {/* BEKLEYEN */}

        <StatCard
          title="Bekleyen"
          value={pending}
          icon={
            <Clock size={26} />
          }
          iconClass="bg-yellow-100 text-yellow-600"
        />

        {/* KABUL */}

        <StatCard
          title="Kabul"
          value={accepted}
          icon={
            <CheckCircle size={26} />
          }
          iconClass="bg-green-100 text-green-600"
        />

        {/* RED */}

        <StatCard
          title="Reddedilen"
          value={rejected}
          icon={
            <XCircle size={26} />
          }
          iconClass="bg-red-100 text-red-600"
        />

      </div>

      {/* =================================================
          GÖRÜNTÜLENME
      ================================================= */}

      <div className="bg-white rounded-2xl shadow p-6">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center">

            <Eye
              size={28}
              className="text-indigo-600"
            />

          </div>

          <div>

            <p className="text-gray-500">
              Toplam İlan Görüntülenmesi
            </p>

            <p className="text-3xl font-bold mt-1">
              {totalViews.toLocaleString(
                "tr-TR"
              )}
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          HIZLI İŞLEMLER
      ================================================= */}

      <div>

        <h2 className="text-xl font-bold mb-4">
          Hızlı İşlemler
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <Link
            to="/employer/create-job"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 transition"
          >

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-lg bg-white/20 flex items-center justify-center">
                <Plus size={22} />
              </div>

              <div>

                <p className="font-bold">
                  Yeni İlan Oluştur
                </p>

                <p className="text-sm text-blue-100 mt-1">
                  Yeni bir iş ilanı yayınla
                </p>

              </div>

            </div>

          </Link>

          <Link
            to="/employer/jobs"
            className="bg-white hover:bg-gray-50 rounded-xl p-5 shadow transition border"
          >

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center">

                <Briefcase
                  size={22}
                  className="text-green-600"
                />

              </div>

              <div>

                <p className="font-bold">
                  İlanlarım
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  İlanlarını yönet
                </p>

              </div>

            </div>

          </Link>

          <Link
            to="/employer/interviews"
            className="bg-white hover:bg-gray-50 rounded-xl p-5 shadow transition border"
          >

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center">

                <Clock
                  size={22}
                  className="text-purple-600"
                />

              </div>

              <div>

                <p className="font-bold">
                  Mülakatlar
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Mülakatlarını yönet
                </p>

              </div>

            </div>

          </Link>

        </div>

      </div>

      {/* =================================================
          SON İLANLAR
      ================================================= */}

      <div className="bg-white rounded-2xl shadow">

        <div className="p-6 border-b flex justify-between items-center">

          <div>

            <h2 className="text-xl font-bold">
              Son İlanlarım
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Son oluşturduğunuz iş ilanları
            </p>

          </div>

          <Link
            to="/employer/jobs"
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 text-sm"
          >
            Tümünü Gör
            <ArrowRight size={16} />
          </Link>

        </div>

        <div className="p-6">

          {latestJobs.length === 0 ? (

            <div className="text-center py-10">

              <Briefcase
                size={45}
                className="mx-auto text-gray-300"
              />

              <p className="text-gray-500 mt-3">
                Henüz ilan oluşturmadınız.
              </p>

              <Link
                to="/employer/create-job"
                className="inline-flex items-center gap-2 mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg"
              >
                <Plus size={18} />
                İlk İlanını Oluştur
              </Link>

            </div>

          ) : (

            <div className="space-y-4">

              {latestJobs.map((job) => (

                <div
                  key={job._id}
                  className="border rounded-xl p-5 hover:shadow-md transition"
                >

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                    <div>

                      <h3 className="text-lg font-bold">
                        {job.title}
                      </h3>

                      <p className="text-gray-500 mt-1">
                        {job.company}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">

                        <span>
                          📍 {job.location}
                        </span>

                        <span>
                          💼 {job.employmentType}
                        </span>

                        <span>
                          👁️ {job.views || 0} görüntülenme
                        </span>

                        <span>
                          👥{" "}
                          {job.applicationCount ||
                            0} başvuru
                        </span>

                      </div>

                    </div>

                    <div className="flex gap-3">

                      <Link
                        to={`/employer/edit-job/${job._id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                      >
                        Düzenle
                      </Link>

                      <Link
                        to={`/employer/applications/${job._id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        Başvurular
                      </Link>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* =================================================
          BAŞVURU ÖZETİ
      ================================================= */}

      <div className="bg-white rounded-2xl shadow p-6">

        <div className="flex items-center gap-3 mb-6">

          <FileText
            size={24}
            className="text-blue-600"
          />

          <div>

            <h2 className="text-xl font-bold">
              Başvuru Özeti
            </h2>

            <p className="text-sm text-gray-500">
              Tüm ilanlarınızdaki başvuru durumları
            </p>

          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-5">

          <div className="bg-yellow-50 rounded-xl p-5">

            <p className="text-yellow-700 font-semibold">
              Bekleyen Başvurular
            </p>

            <p className="text-3xl font-bold mt-2 text-yellow-700">
              {pending}
            </p>

          </div>

          <div className="bg-green-50 rounded-xl p-5">

            <p className="text-green-700 font-semibold">
              Kabul Edilen
            </p>

            <p className="text-3xl font-bold mt-2 text-green-700">
              {accepted}
            </p>

          </div>

          <div className="bg-red-50 rounded-xl p-5">

            <p className="text-red-700 font-semibold">
              Reddedilen
            </p>

            <p className="text-3xl font-bold mt-2 text-red-700">
              {rejected}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

// =====================================================
// STAT CARD
// =====================================================

const StatCard = ({
  title,
  value,
  icon,
  iconClass,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-gray-500">
            {title}
          </p>

          <p className="text-3xl font-bold mt-2">
            {value}
          </p>

        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;