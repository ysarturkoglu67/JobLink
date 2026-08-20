import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import toast from "react-hot-toast";

import {
  MessageCircle,
  CheckCircle,
  XCircle,
  FileText,
  CalendarDays,
  X,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [showInterviewModal, setShowInterviewModal] =
    useState(false);

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  const [creatingInterview, setCreatingInterview] =
    useState(false);

  const [interviewData, setInterviewData] = useState({
    date: "",
    type: "Online",
    location: "",
    meetingLink: "",
    note: "",
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const jobId = searchParams.get("jobId");

  // =====================================================
  // BAŞVURULARI GETİR
  // =====================================================

  useEffect(() => {
    if (jobId) {
      loadApplicants();
    } else {
      setLoading(false);
    }
  }, [jobId]);

  const loadApplicants = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/applications/job/${jobId}`
      );

      setApplications(res.data.applications || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Başvurular yüklenemedi."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // BAŞVURU DURUMU
  // =====================================================

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      const res = await api.patch(
        `/applications/${id}/status`,
        {
          status,
        }
      );

      toast.success(
        res.data.message ||
          "Başvuru güncellendi."
      );

      setApplications((prev) =>
        prev.map((application) =>
          application._id === id
            ? {
                ...application,
                status,
              }
            : application
        )
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Güncelleme başarısız."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // MÜLAKAT MODALINI AÇ
  // =====================================================

  const openInterviewModal = (application) => {
    setSelectedApplication(application);

    setInterviewData({
      date: "",
      type: "Online",
      location: "",
      meetingLink: "",
      note: "",
    });

    setShowInterviewModal(true);
  };

  // =====================================================
  // INPUT DEĞİŞİKLİĞİ
  // =====================================================

  const handleInterviewChange = (e) => {
    setInterviewData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================================
  // MÜLAKAT PLANLA
  // =====================================================

  const createInterview = async (e) => {
    e.preventDefault();

    if (!selectedApplication) {
      return;
    }

    if (!interviewData.date) {
      toast.error("Mülakat tarihi seçiniz.");
      return;
    }

    const selectedDate = new Date(
      interviewData.date
    );

    if (selectedDate <= new Date()) {
      toast.error(
        "Mülakat tarihi gelecekte olmalıdır."
      );
      return;
    }

    if (
      interviewData.type === "Online" &&
      !interviewData.meetingLink.trim()
    ) {
      toast.error(
        "Online mülakat için toplantı linki giriniz."
      );
      return;
    }

    if (
      interviewData.type === "Office" &&
      !interviewData.location.trim()
    ) {
      toast.error(
        "Ofis mülakatı için adres giriniz."
      );
      return;
    }

    try {
      setCreatingInterview(true);

      await api.post("/interviews", {
        application:
          selectedApplication._id,

        date: interviewData.date,

        type: interviewData.type,

        location:
          interviewData.type === "Office"
            ? interviewData.location.trim()
            : "",

        meetingLink:
          interviewData.type === "Online"
            ? interviewData.meetingLink.trim()
            : "",

        note: interviewData.note.trim(),
      });

      toast.success(
        "Mülakat başarıyla planlandı."
      );

      setShowInterviewModal(false);
      setSelectedApplication(null);

      setInterviewData({
        date: "",
        type: "Online",
        location: "",
        meetingLink: "",
        note: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Mülakat planlanamadı."
      );
    } finally {
      setCreatingInterview(false);
    }
  };

  // =====================================================
  // MODAL KAPAT
  // =====================================================

  const closeInterviewModal = () => {
    if (creatingInterview) return;

    setShowInterviewModal(false);
    setSelectedApplication(null);
  };

  // =====================================================
  // JOB ID YOK
  // =====================================================

  if (!jobId && !loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow rounded-xl p-10 text-center">
          <h2 className="text-2xl font-bold">
            İlan seçilmedi.
          </h2>

          <p className="text-gray-500 mt-2">
            Başvuranları görmek için bir ilan seçmelisiniz.
          </p>

          <button
            onClick={() =>
              navigate("/employer/jobs")
            }
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            İlanlarıma Git
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-semibold">
          Başvurular yükleniyor...
        </h2>
      </div>
    );
  }

  // =====================================================
  // SAYFA
  // =====================================================

  return (
    <>
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              Başvuranlar
            </h1>

            <p className="text-gray-500 mt-2">
              Bu ilana yapılan başvuruları yönetin.
            </p>
          </div>

          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
            {applications.length} Başvuru
          </span>

        </div>

        {/* EMPTY */}

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">

            <div className="text-5xl mb-4">
              👥
            </div>

            <h2 className="text-xl font-semibold">
              Henüz başvuru yapılmamış.
            </h2>

            <p className="text-gray-500 mt-2">
              Bu ilana henüz herhangi bir aday başvurmadı.
            </p>

          </div>
        ) : (

          <div className="space-y-6">

            {applications.map((application) => {

              const applicant =
                application.applicant;

              const isUpdating =
                updatingId === application._id;

              return (
                <div
                  key={application._id}
                  className="bg-white shadow rounded-xl p-6"
                >

                  {/* ADAY */}

                  <div className="flex flex-col lg:flex-row justify-between gap-6">

                    <div className="flex-1">

                      <div className="flex items-start gap-4">

                        {/* AVATAR */}

                        <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center shrink-0">

                          {applicant?.avatar ? (
                            <img
                              src={
                                applicant.avatar.startsWith(
                                  "http"
                                )
                                  ? applicant.avatar
                                  : `https://kariyerinsa-api.onrender.com${applicant.avatar}`
                              }
                              alt={applicant.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User
                              size={28}
                              className="text-blue-600"
                            />
                          )}

                        </div>

                        {/* BİLGİLER */}

                        <div>

                          <h2 className="text-xl font-bold">
                            {applicant?.name ||
                              "İsimsiz Aday"}
                          </h2>

                          {applicant?.email && (
                            <p className="text-gray-500 mt-1 flex items-center gap-2">
                              <Mail size={15} />
                              {applicant.email}
                            </p>
                          )}

                          {applicant?.phone && (
                            <p className="text-gray-500 mt-1 flex items-center gap-2">
                              <Phone size={15} />
                              {applicant.phone}
                            </p>
                          )}

                          {applicant?.city && (
                            <p className="text-gray-500 mt-1 flex items-center gap-2">
                              <MapPin size={15} />
                              {applicant.city}
                            </p>
                          )}

                        </div>

                      </div>

                      {/* ÖN YAZI */}

                      {application.coverLetter && (
                        <div className="mt-5 bg-gray-50 rounded-lg p-4">

                          <h3 className="font-semibold">
                            Ön Yazı
                          </h3>

                          <p className="text-gray-700 mt-2 whitespace-pre-line">
                            {application.coverLetter}
                          </p>

                        </div>
                      )}

                      {/* BAŞVURU TARİHİ */}

                      <p className="text-sm text-gray-400 mt-4">
                        Başvuru tarihi:{" "}
                        {new Date(
                          application.createdAt
                        ).toLocaleDateString(
                          "tr-TR"
                        )}
                      </p>

                    </div>

                    {/* BUTONLAR */}

                    <div className="flex flex-col gap-2 w-full lg:w-52">

                      {/* CV */}

                      {applicant?.cv && (
                        <a
                          href={`https://kariyerinsa-api.onrender.com${applicant.cv}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                        >
                          <FileText size={18} />
                          CV Görüntüle
                        </a>
                      )}

                      {/* MESAJ */}

                      <button
                        onClick={() =>
                          navigate(
                            `/chat/${applicant._id}`
                          )
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={18} />
                        Mesaj Gönder
                      </button>

                      {/* KABUL */}

                      <button
                        disabled={isUpdating}
                        onClick={() =>
                          updateStatus(
                            application._id,
                            "Accepted"
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />

                        {isUpdating
                          ? "Güncelleniyor..."
                          : "Kabul Et"}
                      </button>

                      {/* RED */}

                      <button
                        disabled={isUpdating}
                        onClick={() =>
                          updateStatus(
                            application._id,
                            "Rejected"
                          )
                        }
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                      >
                        <XCircle size={18} />

                        {isUpdating
                          ? "Güncelleniyor..."
                          : "Reddet"}
                      </button>

                      {/* MÜLAKAT */}

                      <button
                        onClick={() =>
                          openInterviewModal(
                            application
                          )
                        }
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                      >
                        <CalendarDays size={18} />
                        Mülakat Planla
                      </button>

                    </div>

                  </div>

                  {/* DURUM */}

                  <div className="mt-6 border-t pt-5">

                    <span
                      className={`inline-flex px-4 py-2 rounded-full text-white font-semibold ${
                        application.status ===
                        "Pending"
                          ? "bg-yellow-500"
                          : application.status ===
                            "Accepted"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {application.status ===
                      "Pending"
                        ? "Beklemede"
                        : application.status ===
                          "Accepted"
                        ? "Kabul Edildi"
                        : "Reddedildi"}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* =====================================================
          MÜLAKAT MODAL
      ===================================================== */}

      {showInterviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">

            {/* HEADER */}

            <div className="flex justify-between items-center p-6 border-b">

              <div>
                <h2 className="text-2xl font-bold">
                  Mülakat Planla
                </h2>

                {selectedApplication && (
                  <p className="text-gray-500 mt-1">
                    {selectedApplication.applicant?.name}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={closeInterviewModal}
                disabled={creatingInterview}
                className="text-gray-500 hover:text-gray-800 disabled:opacity-50"
              >
                <X size={24} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={createInterview}
              className="p-6 space-y-5"
            >

              {/* TARİH */}

              <div>
                <label className="block font-medium mb-2">
                  Tarih ve Saat
                </label>

                <input
                  type="datetime-local"
                  name="date"
                  value={interviewData.date}
                  onChange={handleInterviewChange}
                  min={new Date()
                    .toISOString()
                    .slice(0, 16)}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* TİP */}

              <div>
                <label className="block font-medium mb-2">
                  Mülakat Tipi
                </label>

                <select
                  name="type"
                  value={interviewData.type}
                  onChange={handleInterviewChange}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="Online">
                    Online
                  </option>

                  <option value="Office">
                    Ofiste
                  </option>
                </select>
              </div>

              {/* ONLINE */}

              {interviewData.type ===
                "Online" && (
                <div>
                  <label className="block font-medium mb-2">
                    Toplantı Linki
                  </label>

                  <input
                    type="url"
                    name="meetingLink"
                    value={
                      interviewData.meetingLink
                    }
                    onChange={
                      handleInterviewChange
                    }
                    placeholder="https://meet.google.com/..."
                    className="w-full border rounded-lg p-3"
                  />
                </div>
              )}

              {/* OFİS */}

              {interviewData.type ===
                "Office" && (
                <div>
                  <label className="block font-medium mb-2">
                    Mülakat Adresi
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={
                      interviewData.location
                    }
                    onChange={
                      handleInterviewChange
                    }
                    placeholder="İstanbul, Başakşehir..."
                    className="w-full border rounded-lg p-3"
                  />
                </div>
              )}

              {/* NOT */}

              <div>
                <label className="block font-medium mb-2">
                  Not
                </label>

                <textarea
                  name="note"
                  value={interviewData.note}
                  onChange={handleInterviewChange}
                  placeholder="Adaya iletmek istediğiniz not..."
                  rows={4}
                  className="w-full border rounded-lg p-3 resize-none"
                />
              </div>

              {/* BUTONLAR */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeInterviewModal}
                  disabled={creatingInterview}
                  className="flex-1 border border-gray-300 rounded-lg py-3 hover:bg-gray-100 disabled:opacity-50"
                >
                  İptal
                </button>

                <button
                  type="submit"
                  disabled={creatingInterview}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg py-3"
                >
                  {creatingInterview
                    ? "Planlanıyor..."
                    : "Mülakatı Planla"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </>
  );
};

export default Applicants;