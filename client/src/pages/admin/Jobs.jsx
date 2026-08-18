import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import {
  Search,
  Trash2,
  MapPin,
  Building2,
  Briefcase,
} from "lucide-react";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await api.get("/admin/jobs");
      setJobs(res.data.jobs);
    } catch {
      toast.error("İlanlar yüklenemedi.");
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Bu ilan silinsin mi?")) return;

    try {
      await api.delete(`/admin/jobs/${id}`);

      toast.success("İlan silindi.");

      loadJobs();
    } catch {
      toast.error("Silme başarısız.");
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          İş İlanları
        </h1>

        <div className="relative">

          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />

          <input
            placeholder="İlan ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-80"
          />

        </div>

      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">
                Pozisyon
              </th>

              <th>Firma</th>

              <th>Şehir</th>

              <th>Tür</th>

              <th>Maaş</th>

              <th>İşveren</th>

              <th>Tarih</th>

              <th>İşlem</th>

            </tr>

          </thead>

          <tbody>

            {filteredJobs.map((job) => (

              <tr
                key={job._id}
                className="border-t hover:bg-gray-50 transition"
              >

                <td className="p-4">

                  <div className="flex items-center gap-2">

                    <Briefcase
                      size={18}
                      className="text-blue-600"
                    />

                    <span className="font-semibold">
                      {job.title}
                    </span>

                  </div>

                </td>

                <td>

                  <div className="flex items-center gap-2">

                    <Building2
                      size={18}
                      className="text-green-600"
                    />

                    {job.company}

                  </div>

                </td>

                <td>

                  <div className="flex items-center gap-2">

                    <MapPin
                      size={18}
                      className="text-red-600"
                    />

                    {job.location}

                  </div>

                </td>

                <td>

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

                    {job.employmentType}

                  </span>

                </td>

                <td>

                  ₺{Number(job.salary || 0).toLocaleString("tr-TR")}

                </td>

                <td>

                  {job.createdBy?.name || "-"}

                </td>

                <td>

                  {new Date(job.createdAt).toLocaleDateString("tr-TR")}

                </td>

                <td>

                  <button
                    onClick={() => deleteJob(job._id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                  >

                    <Trash2 size={18} />

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Jobs;