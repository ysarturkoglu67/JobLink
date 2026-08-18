import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Building2,
  MapPin,
  Video,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
} from "lucide-react";

const EmployerInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      const res = await api.get("/interviews/employer");

      setInterviews(res.data.interviews || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Mülakatlar yüklenemedi."
      );
    } finally {
      setLoading(false);
    }
  };

  // Mülakat durumunu güncelle
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/interviews/${id}`, {
        status,
      });

      toast.success(
        status === "Completed"
          ? "Mülakat tamamlandı olarak işaretlendi."
          : "Mülakat güncellendi."
      );

      loadInterviews();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Mülakat güncellenemedi."
      );
    }
  };

  // Mülakatı iptal et
  const cancelInterview = async (id) => {
    if (
      !window.confirm(
        "Bu mülakatı iptal etmek istediğinize emin misiniz?"
      )
    ) {
      return;
    }

    try {
      await api.put(`/interviews/${id}`, {
        status: "Cancelled",
      });

      toast.success("Mülakat iptal edildi.");

      loadInterviews();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Mülakat iptal edilemedi."
      );
    }
  };

  const getStatus = (status) => {
    switch (status) {
      case "Scheduled":
        return {
          text: "Planlandı",
          className:
            "bg-blue-100 text-blue-700",
          icon: <Clock size={16} />,
        };

      case "Completed":
        return {
          text: "Tamamlandı",
          className:
            "bg-green-100 text-green-700",
          icon: <CheckCircle size={16} />,
        };

      case "Cancelled":
        return {
          text: "İptal Edildi",
          className:
            "bg-red-100 text-red-700",
          icon: <XCircle size={16} />,
        };

      default:
        return {
          text: status || "Bilinmiyor",
          className:
            "bg-gray-100 text-gray-700",
          icon: <Clock size={16} />,
        };
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12">

        <h1 className="text-3xl font-bold mb-8">
          Mülakatlar
        </h1>

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

  return (
    <div className="max-w-6xl mx-auto py-12">

      {/* Başlık */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            Planlanan Mülakatlar
          </h1>

          <p className="text-gray-500 mt-2">
            Adaylarla planladığınız iş görüşmeleri.
          </p>
        </div>

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
          {interviews.length} Mülakat
        </span>

      </div>

      {/* Liste */}

      {interviews.length === 0 ? (

        <div className="bg-white rounded-2xl shadow p-10 text-center">

          <div className="text-5xl mb-5">
            📅
          </div>

          <h2 className="text-xl font-bold">
            Henüz mülakat bulunmuyor
          </h2>

          <p className="text-gray-500 mt-2">
            Bir aday için mülakat planladığınızda
            burada görünecek.
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {interviews.map((item) => {

            const status = getStatus(
              item.status
            );

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
              >

                {/* Üst */}

                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">

                  <div className="flex gap-4">

                    <img
                      src={
                        item.candidate?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          item.candidate?.name ||
                            "Aday"
                        )}`
                      }
                      alt={item.candidate?.name}
                      className="w-16 h-16 rounded-full object-cover border"
                    />

                    <div>

                      <h2 className="text-2xl font-bold">
                        {item.candidate?.name ||
                          "Aday"}
                      </h2>

                      <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <Mail size={16} />

                        {item.candidate?.email ||
                          "E-posta bulunamadı"}
                      </p>

                      <p className="text-blue-600 font-medium mt-2">
                        {item.job?.title ||
                          "İş ilanı"}
                      </p>

                    </div>

                  </div>

                  {/* Durum */}

                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${status.className}`}
                  >
                    {status.icon}

                    {status.text}
                  </span>

                </div>

                {/* Bilgiler */}

                <div className="grid md:grid-cols-2 gap-4 mt-6">

                  {/* Tarih */}

                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">

                    <CalendarDays
                      size={21}
                      className="text-blue-600"
                    />

                    <div>
                      <p className="text-sm text-gray-500">
                        Mülakat Tarihi
                      </p>

                      <p className="font-semibold">
                        {new Date(
                          item.date
                        ).toLocaleString(
                          "tr-TR",
                          {
                            dateStyle:
                              "medium",
                            timeStyle:
                              "short",
                          }
                        )}
                      </p>
                    </div>

                  </div>

                  {/* Tip */}

                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">

                    {item.type ===
                    "Online" ? (
                      <Video
                        size={21}
                        className="text-blue-600"
                      />
                    ) : (
                      <Building2
                        size={21}
                        className="text-blue-600"
                      />
                    )}

                    <div>
                      <p className="text-sm text-gray-500">
                        Mülakat Tipi
                      </p>

                      <p className="font-semibold">
                        {item.type ===
                        "Online"
                          ? "Online"
                          : "Ofiste"}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Adres */}

                {item.location && (
                  <div className="mt-5 flex gap-3">

                    <MapPin
                      size={20}
                      className="text-gray-500 mt-1"
                    />

                    <div>
                      <p className="text-sm text-gray-500">
                        Konum
                      </p>

                      <p className="font-medium">
                        {item.location}
                      </p>
                    </div>

                  </div>
                )}

                {/* Toplantı Linki */}

                {item.meetingLink &&
                  item.status !==
                    "Cancelled" && (

                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
                    >
                      <Video size={18} />

                      Toplantıya Katıl
                    </a>
                  )}

                {/* Not */}

                {item.note && (
                  <div className="mt-5 bg-gray-50 border rounded-xl p-4">

                    <div className="flex items-center gap-2 font-semibold mb-2">

                      <FileText size={18} />

                      Mülakat Notu

                    </div>

                    <p className="text-gray-700">
                      {item.note}
                    </p>

                  </div>
                )}

                {/* Butonlar */}

                {item.status ===
                  "Scheduled" && (

                  <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t">

                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(
                          item._id,
                          "Completed"
                        )
                      }
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg transition"
                    >
                      <CheckCircle
                        size={18}
                      />

                      Tamamlandı
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        cancelInterview(
                          item._id
                        )
                      }
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition"
                    >
                      <XCircle size={18} />

                      İptal Et
                    </button>

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

export default EmployerInterviews;