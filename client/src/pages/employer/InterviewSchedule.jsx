import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const InterviewSchedule = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    date: "",
    type: "Online",
    location: "",
    meetingLink: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const save = async (e) => {
    e.preventDefault();

    if (!form.date) {
      toast.error("Mülakat tarihi seçin.");
      return;
    }

    if (new Date(form.date) <= new Date()) {
      toast.error(
        "Mülakat tarihi gelecekte olmalıdır."
      );
      return;
    }

    if (
      form.type === "Online" &&
      !form.meetingLink.trim()
    ) {
      toast.error("Toplantı linki girin.");
      return;
    }

    if (
      form.type === "Office" &&
      !form.location.trim()
    ) {
      toast.error("Mülakat adresini girin.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/interviews", {
        application: applicationId,
        date: form.date,
        type: form.type,
        location:
          form.type === "Office"
            ? form.location
            : "",
        meetingLink:
          form.type === "Online"
            ? form.meetingLink
            : "",
        note: form.note,
      });

      toast.success(
        res.data.message ||
          "Mülakat planlandı."
      );

      navigate("/employer/interviews");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Mülakat oluşturulamadı."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">

      <h1 className="text-3xl font-bold mb-8">
        Mülakat Planla
      </h1>

      <form
        onSubmit={save}
        className="bg-white rounded-2xl shadow p-8 space-y-6"
      >

        {/* Tarih */}
        <div>
          <label className="block font-medium mb-2">
            Mülakat Tarihi
          </label>

          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tip */}
        <div>
          <label className="block font-medium mb-2">
            Mülakat Tipi
          </label>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
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

        {/* Online */}
        {form.type === "Online" && (
          <div>
            <label className="block font-medium mb-2">
              Toplantı Linki
            </label>

            <input
              type="url"
              name="meetingLink"
              placeholder="https://meet.google.com/..."
              value={form.meetingLink}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Ofis */}
        {form.type === "Office" && (
          <div>
            <label className="block font-medium mb-2">
              Mülakat Adresi
            </label>

            <input
              type="text"
              name="location"
              placeholder="Şirket adresi"
              value={form.location}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Not */}
        <div>
          <label className="block font-medium mb-2">
            Not
          </label>

          <textarea
            name="note"
            rows={5}
            placeholder="Adaya iletmek istediğiniz not..."
            value={form.note}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buton */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
        >
          {loading
            ? "Planlanıyor..."
            : "Mülakat Oluştur"}
        </button>

      </form>
    </div>
  );
};

export default InterviewSchedule;