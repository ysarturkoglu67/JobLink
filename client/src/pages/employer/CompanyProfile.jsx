import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const CompanyProfile = () => {
  const [form, setForm] = useState({
    companyName: "",
    companyWebsite: "",
    companySize: "",
    companyAddress: "",
    companyDescription: "",
    companyLogo: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      setLoading(true);

      const res = await api.get("/employer/company");

      setForm({
        companyName: res.data.company?.companyName || "",
        companyWebsite: res.data.company?.companyWebsite || "",
        companySize: res.data.company?.companySize || "",
        companyAddress: res.data.company?.companyAddress || "",
        companyDescription:
          res.data.company?.companyDescription || "",
        companyLogo: res.data.company?.companyLogo || "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Şirket bilgileri alınamadı."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const save = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await api.put(
        "/employer/company",
        form
      );

      setForm({
        companyName: res.data.company?.companyName || "",
        companyWebsite:
          res.data.company?.companyWebsite || "",
        companySize:
          res.data.company?.companySize || "",
        companyAddress:
          res.data.company?.companyAddress || "",
        companyDescription:
          res.data.company?.companyDescription || "",
        companyLogo:
          res.data.company?.companyLogo || "",
      });

      toast.success(
        "Şirket bilgileri güncellendi."
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Kaydedilemedi."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        Yükleniyor...
      </div>
    );
  }

  const logoUrl = form.companyLogo
    ? form.companyLogo.startsWith("http")
      ? form.companyLogo
      : `http://localhost:5000${form.companyLogo}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        form.companyName || "Company"
      )}`;

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Şirket Profili
      </h1>

      {/* Şirket Önizleme */}

      <div className="bg-white shadow rounded-xl p-6 mb-8 flex items-center gap-6">

        <img
          src={logoUrl}
          alt={form.companyName || "Şirket"}
          className="w-24 h-24 rounded-xl object-cover border"
          onError={(e) => {
            e.currentTarget.src =
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                form.companyName || "Company"
              )}`;
          }}
        />

        <div>

          <h2 className="text-2xl font-bold">
            {form.companyName || "Şirket Adı"}
          </h2>

          {form.companyWebsite && (
            <p className="text-gray-500 mt-1">
              {form.companyWebsite}
            </p>
          )}

          {form.companyAddress && (
            <p className="text-gray-500 mt-1">
              📍 {form.companyAddress}
            </p>
          )}

        </div>

      </div>

      {/* Form */}

      <form
        onSubmit={save}
        className="bg-white rounded-xl shadow p-8 grid md:grid-cols-2 gap-5"
      >

        <input
          name="companyName"
          className="w-full border p-3 rounded-lg"
          placeholder="Şirket Adı"
          value={form.companyName}
          onChange={handleChange}
        />

        <input
          name="companyWebsite"
          className="w-full border p-3 rounded-lg"
          placeholder="Website"
          value={form.companyWebsite}
          onChange={handleChange}
        />

        <input
          name="companySize"
          className="w-full border p-3 rounded-lg"
          placeholder="Çalışan Sayısı"
          value={form.companySize}
          onChange={handleChange}
        />

        <input
          name="companyAddress"
          className="w-full border p-3 rounded-lg"
          placeholder="Adres"
          value={form.companyAddress}
          onChange={handleChange}
        />

        <input
          name="companyLogo"
          className="w-full border p-3 rounded-lg md:col-span-2"
          placeholder="Logo URL"
          value={form.companyLogo}
          onChange={handleChange}
        />

        <textarea
          name="companyDescription"
          rows={6}
          className="w-full border p-3 rounded-lg md:col-span-2"
          placeholder="Şirket Açıklaması"
          value={form.companyDescription}
          onChange={handleChange}
        />

        <div className="md:col-span-2 flex justify-end">

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default CompanyProfile;