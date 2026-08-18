import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  CalendarDays,
  Briefcase,
  Heart,
  ArrowRight,
  Search,
  User,
} from "lucide-react";

import api from "../../api/axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // VERİLERİ GETİR
  // =====================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        applicationsRes,
        interviewsRes,
      ] = await Promise.all([
        api.get("/applications/my-applications"),
        api.get("/interviews/candidate"),
      ]);

      setApplications(
        applicationsRes.data.applications || []
      );

      setInterviews(
        interviewsRes.data.interviews || []
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Dashboard verileri yüklenemedi."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // İSTATİSTİKLER
  // =====================================================

  const pending = applications.filter(
    (app) => app.status === "Pending"
  ).length;

  const accepted = applications.filter(
    (app) => app.status === "Accepted"
  ).length;

  const rejected = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const scheduledInterviews =
    interviews.filter(
      (interview) =>
        interview.status === "Scheduled"
    );

  // =====================================================
  // SON BAŞVURULAR
  // =====================================================

  const latestApplications =
    [...applications]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 5);

  // =====================================================
  // YAKLAŞAN MÜLAKATLAR
  // =====================================================

  const upcomingInterviews =
    [...scheduledInterviews]
      .filter(
        (interview) =>
          new Date(interview.date) >
          new Date()
      )
      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      )
      .slice(0, 3);

  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (status) => {
    if (status === "Accepted") {
      return {
        text: "Kabul Edildi",
        className:
          "bg-green-100 text-green-700",
        icon: CheckCircle,
      };
    }

    if (status === "Rejected") {
      return {
        text: "Reddedildi",
        className:
          "bg-red-100 text-red-700",
        icon: XCircle,
      };
    }

    return {
      text: "Beklemede",
      className:
        "bg-yellow-100 text-yellow-700",
      icon: Clock,
    };
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">

        <div>
          <div className="h-9 bg-gray-200 rounded w-48" />

          <div className="h-4 bg-gray-200 rounded w-80 mt-3" />
        </div>

        <div className="grid md:grid-cols-4 gap-6">

          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow p-6 h-32"
              />
            )
          )}

        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-2xl shadow h-80" />

          <div className="bg-white rounded-2xl shadow h-80" />

        </div>

      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>

        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Başvurularınızı ve mülakatlarınızı
          buradan takip edebilirsiniz.
        </p>

      </div>

      {/* =================================================
          İSTATİSTİKLER
      ================================================= */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* TOPLAM */}

        <div className="bg-white rounded-2xl shadow p-6">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-gray-500">
                Toplam Başvuru
              </p>

              <p className="text-4xl font-bold mt-2">
                {applications.length}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText
                className="text-blue-600"
                size={24}
              />
            </div>

          </div>

        </div>

        {/* BEKLEYEN */}

        <div className="bg-yellow-50 rounded-2xl p-6">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-yellow-700">
                Bekleyen
              </p>

              <p className="text-4xl font-bold mt-2">
                {pending}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Clock
                className="text-yellow-600"
                size={24}
              />
            </div>

          </div>

        </div>

        {/* KABUL */}

        <div className="bg-green-50 rounded-2xl p-6">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-green-700">
                Kabul Edilen
              </p>

              <p className="text-4xl font-bold mt-2">
                {accepted}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle
                className="text-green-600"
                size={24}
              />
            </div>

          </div>

        </div>

        {/* RED */}

        <div className="bg-red-50 rounded-2xl p-6">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-red-700">
                Reddedilen
              </p>

              <p className="text-4xl font-bold mt-2">
                {rejected}
              </p>

            </div>

            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <XCircle
                className="text-red-600"
                size={24}
              />
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          HIZLI İŞLEMLER
      ================================================= */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 transition"
        >

          <div className="flex items-center gap-3">

            <Search size={22} />

            <div>

              <p className="font-semibold">
                İş İlanı Ara
              </p>

              <p className="text-sm text-blue-100">
                Yeni fırsatları keşfet
              </p>

            </div>

          </div>

        </Link>

        <Link
          to="/candidate/applications"
          className="bg-white hover:bg-gray-50 rounded-xl p-5 shadow transition"
        >

          <div className="flex items-center gap-3">

            <FileText
              size={22}
              className="text-blue-600"
            />

            <div>

              <p className="font-semibold">
                Başvurularım
              </p>

              <p className="text-sm text-gray-500">
                Tüm başvurularını gör
              </p>

            </div>

          </div>

        </Link>

        <Link
          to="/candidate/saved-jobs"
          className="bg-white hover:bg-gray-50 rounded-xl p-5 shadow transition"
        >

          <div className="flex items-center gap-3">

            <Heart
              size={22}
              className="text-red-500"
            />

            <div>

              <p className="font-semibold">
                Favorilerim
              </p>

              <p className="text-sm text-gray-500">
                Kaydettiğin ilanlar
              </p>

            </div>

          </div>

        </Link>

        <Link
          to="/candidate/profile"
          className="bg-white hover:bg-gray-50 rounded-xl p-5 shadow transition"
        >

          <div className="flex items-center gap-3">

            <User
              size={22}
              className="text-purple-600"
            />

            <div>

              <p className="font-semibold">
                Profilim
              </p>

              <p className="text-sm text-gray-500">
                Profilini güncelle
              </p>

            </div>

          </div>

        </Link>

      </div>

      {/* =================================================
          ALT BÖLÜM
      ================================================= */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* =================================================
            SON BAŞVURULAR
        ================================================= */}

        <div className="bg-white rounded-2xl shadow">

          <div className="p-6 border-b flex justify-between items-center">

            <div>

              <h2 className="text-xl font-bold">
                Son Başvurular
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Son gönderdiğiniz başvurular
              </p>

            </div>

            <Link
              to="/candidate/applications"
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1"
            >
              Tümü
              <ArrowRight size={16} />
            </Link>

          </div>

          <div className="p-6">

            {latestApplications.length === 0 ? (
              <div className="text-center py-10">

                <FileText
                  size={40}
                  className="mx-auto text-gray-300"
                />

                <p className="text-gray-500 mt-3">
                  Henüz başvurunuz yok.
                </p>

                <Link
                  to="/"
                  className="inline-block mt-4 text-blue-600 font-semibold"
                >
                  İş ilanlarını keşfet →
                </Link>

              </div>
            ) : (

              <div className="space-y-4">

                {latestApplications.map(
                  (application) => {

                    if (!application.job) {
                      return (
                        <div
                          key={application._id}
                          className="border rounded-xl p-4"
                        >
                          <p className="font-semibold">
                            İlan artık mevcut değil
                          </p>
                        </div>
                      );
                    }

                    const status =
                      getStatus(
                        application.status
                      );

                    const StatusIcon =
                      status.icon;

                    return (
                      <div
                        key={application._id}
                        className="border rounded-xl p-4 hover:bg-gray-50 transition"
                      >

                        <div className="flex justify-between gap-4">

                          <div>

                            <Link
                              to={`/jobs/${application.job._id}`}
                              className="font-semibold hover:text-blue-600"
                            >
                              {
                                application.job
                                  .title
                              }
                            </Link>

                            <p className="text-sm text-gray-500 mt-1">
                              {
                                application.job
                                  .company
                              }
                            </p>

                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(
                                application.createdAt
                              ).toLocaleDateString(
                                "tr-TR"
                              )}
                            </p>

                          </div>

                          <span
                            className={`self-start px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${status.className}`}
                          >
                            <StatusIcon
                              size={14}
                            />

                            {status.text}
                          </span>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </div>

        {/* =================================================
            YAKLAŞAN MÜLAKATLAR
        ================================================= */}

        <div className="bg-white rounded-2xl shadow">

          <div className="p-6 border-b flex justify-between items-center">

            <div>

              <h2 className="text-xl font-bold">
                Yaklaşan Mülakatlar
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Planlanan mülakatlarınız
              </p>

            </div>

            <Link
              to="/candidate/interviews"
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1"
            >
              Tümü
              <ArrowRight size={16} />
            </Link>

          </div>

          <div className="p-6">

            {upcomingInterviews.length ===
            0 ? (
              <div className="text-center py-10">

                <CalendarDays
                  size={40}
                  className="mx-auto text-gray-300"
                />

                <p className="text-gray-500 mt-3">
                  Yaklaşan mülakatınız yok.
                </p>

              </div>
            ) : (

              <div className="space-y-4">

                {upcomingInterviews.map(
                  (interview) => (
                    <div
                      key={interview._id}
                      className="border rounded-xl p-4"
                    >

                      <div className="flex justify-between gap-4">

                        <div>

                          <p className="font-semibold">
                            {interview.job?.title ||
                              "Mülakat"}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {interview.job?.company ||
                              interview.employer?.name}
                          </p>

                        </div>

                        <CalendarDays
                          size={22}
                          className="text-purple-600"
                        />

                      </div>

                      <div className="mt-4 flex flex-wrap gap-3 text-sm">

                        <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg">
                          {new Date(
                            interview.date
                          ).toLocaleDateString(
                            "tr-TR"
                          )}
                        </span>

                        <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">
                          {new Date(
                            interview.date
                          ).toLocaleTimeString(
                            "tr-TR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>

                        <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">
                          {interview.type}
                        </span>

                      </div>

                      {interview.meetingLink && (
                        <a
                          href={
                            interview.meetingLink
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Toplantıya Katıl →
                        </a>
                      )}

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;