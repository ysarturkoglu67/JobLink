import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Video,
  Building2,
  ExternalLink,
} from "lucide-react";

import api from "../../api/axios";
import toast from "react-hot-toast";

const CandidateInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  // =====================================================
  // MÜLAKATLARI GETİR
  // =====================================================

  const loadInterviews = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/interviews/candidate"
      );

      setInterviews(
        res.data.interviews || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Mülakatlar yüklenemedi."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = (status) => {
    switch (status) {
      case "Scheduled":
        return {
          text: "Planlandı",
          className:
            "bg-green-100 text-green-700 border-green-200",
        };

      case "Completed":
        return {
          text: "Tamamlandı",
          className:
            "bg-blue-100 text-blue-700 border-blue-200",
        };

      case "Cancelled":
        return {
          text: "İptal Edildi",
          className:
            "bg-red-100 text-red-700 border-red-200",
        };

      default:
        return {
          text: status || "Bilinmiyor",
          className:
            "bg-gray-100 text-gray-700 border-gray-200",
        };
    }
  };

  // =====================================================
  // MÜLAKAT ZAMANI
  // =====================================================

  const getInterviewTime = (date) => {
    const interviewDate = new Date(date);
    const now = new Date();

    const difference =
      interviewDate.getTime() -
      now.getTime();

    if (difference <= 0) {
      return {
        text: "Tarih geçti",
        className: "text-gray-500",
      };
    }

    const hours = Math.floor(
      difference / (1000 * 60 * 60)
    );

    const days = Math.floor(
      hours / 24
    );

    if (days > 0) {
      return {
        text: `${days} gün kaldı`,
        className:
          "text-blue-600",
      };
    }

    return {
      text: `${hours} saat kaldı`,
      className:
        "text-orange-600",
    };
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold">
            Mülakatlarım
          </h1>

          <p className="text-gray-500 mt-2">
            Planlanan ve geçmiş mülakatlarınız.
          </p>
        </div>

        <div className="space-y-5">

          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow p-6 animate-pulse"
              >

                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />

                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />

                <div className="h-4 bg-gray-200 rounded w-1/2" />

              </div>
            )
          )}

        </div>

      </div>
    );
  }

  // =====================================================
  // SAYFA
  // =====================================================

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            Mülakatlarım
          </h1>

          <p className="text-gray-500 mt-2">
            Planlanan ve geçmiş mülakatlarınızı
            buradan takip edebilirsiniz.
          </p>

        </div>

        <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold w-fit">
          {interviews.length} Mülakat
        </span>

      </div>

      {/* EMPTY */}

      {interviews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">

          <div className="text-5xl mb-5">
            📅
          </div>

          <h2 className="text-xl font-bold">
            Henüz mülakatınız yok
          </h2>

          <p className="text-gray-500 mt-2">
            Bir işveren başvurunuz için mülakat
            planladığında burada görünecektir.
          </p>

        </div>
      ) : (

        <div className="space-y-6">

          {interviews.map((item) => {

            const status = getStatus(
              item.status
            );

            const timeInfo =
              item.status === "Scheduled"
                ? getInterviewTime(item.date)
                : null;

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
              >

                {/* HEADER */}

                <div className="flex flex-col lg:flex-row lg:justify-between gap-5">

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-2xl font-bold">
                        {item.job?.title ||
                          "İş İlanı"}
                      </h2>

                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-semibold ${status.className}`}
                      >
                        {status.text}
                      </span>

                    </div>

                    <p className="text-gray-500 flex items-center gap-2 mt-2">
                      <Building2 size={17} />

                      {item.job?.company ||
                        item.employer?.companyName ||
                        item.employer?.name ||
                        "Şirket"}
                    </p>

                  </div>

                  {/* KALAN SÜRE */}

                  {timeInfo && (
                    <div
                      className={`flex items-center gap-2 font-semibold ${timeInfo.className}`}
                    >
                      <Clock size={18} />
                      {timeInfo.text}
                    </div>
                  )}

                </div>

                {/* BİLGİLER */}

                <div className="mt-6 grid md:grid-cols-2 gap-4">

                  <div className="bg-gray-50 rounded-xl p-4">

                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <CalendarDays size={17} />
                      Tarih
                    </div>

                    <p className="font-semibold">
                      {new Date(
                        item.date
                      ).toLocaleDateString(
                        "tr-TR",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>

                    <p className="text-gray-600 mt-1">
                      {new Date(
                        item.date
                      ).toLocaleTimeString(
                        "tr-TR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">

                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      {item.type === "Online" ? (
                        <Video size={17} />
                      ) : (
                        <MapPin size={17} />
                      )}

                      Mülakat Türü
                    </div>

                    <p className="font-semibold">
                      {item.type ===
                      "Online"
                        ? "Online Mülakat"
                        : "Ofis Mülakatı"}
                    </p>

                    {item.location && (
                      <p className="text-gray-600 mt-1">
                        {item.location}
                      </p>
                    )}

                  </div>

                </div>

                {/* ONLINE TOPLANTI */}

                {item.meetingLink &&
                  item.status ===
                    "Scheduled" && (

                  <div className="mt-6">

                    <a
                      href={
                        item.meetingLink
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                    >
                      <Video size={19} />
                      Toplantıya Katıl
                      <ExternalLink
                        size={16}
                      />
                    </a>

                  </div>
                )}

                {/* NOT */}

                {item.note && (
                  <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">

                    <h3 className="font-semibold text-blue-800">
                      İşveren Notu
                    </h3>

                    <p className="text-gray-700 mt-2 whitespace-pre-line">
                      {item.note}
                    </p>

                  </div>
                )}

                {/* İPTAL */}

                {item.status ===
                  "Cancelled" && (
                  <div className="mt-6 bg-red-50 border border-red-100 text-red-700 rounded-xl p-4">

                    Bu mülakat işveren
                    tarafından iptal edildi.

                  </div>
                )}

                {/* TAMAMLANDI */}

                {item.status ===
                  "Completed" && (
                  <div className="mt-6 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl p-4">

                    Bu mülakat tamamlandı.

                  </div>
                )}

                {/* İLANI GÖR */}

                {item.job?._id && (
                  <div className="mt-6 pt-5 border-t">

                    <Link
                      to={`/jobs/${item.job._id}`}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      İlanı Görüntüle
                    </Link>

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default CandidateInterviews;