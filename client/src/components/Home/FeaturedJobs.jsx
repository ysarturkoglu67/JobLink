import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import {
  MapPin,
  Briefcase,
  Banknote,
} from "lucide-react";

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedJobs();
  }, []);

  const loadFeaturedJobs = async () => {
    try {
      const res = await api.get("/jobs", {
        params: {
          page: 1,
          limit: 6,
          sort: "-createdAt",
        },
      });

      setJobs(res.data.jobs || []);
    } catch (error) {
      console.error(
        "Öne çıkan ilanlar yüklenemedi:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h2 className="text-3xl font-bold">
            Öne Çıkan İlanlar
          </h2>

          <p className="text-gray-500 mt-2">
            En yeni iş fırsatlarını keşfedin.
          </p>
        </div>

        <Link
          to="/"
          className="text-blue-600 font-semibold hover:text-blue-700"
        >
          Tüm İlanları Gör →
        </Link>

      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow p-6 animate-pulse"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-xl mb-5" />

                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />

                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />

                <div className="h-4 bg-gray-200 rounded w-full mb-3" />

                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            )
          )}

        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Henüz ilan bulunmuyor.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 relative"
            >

              <div className="flex gap-4 mb-5">

                <img
                  src={
                    job.companyLogo ||
                    "https://placehold.co/80x80?text=Logo"
                  }
                  alt={job.company}
                  className="w-16 h-16 rounded-xl object-cover border"
                />

                <div className="min-w-0">

                  <h3 className="text-xl font-bold truncate">
                    {job.title}
                  </h3>

                  <p className="text-gray-500 truncate">
                    {job.company}
                  </p>

                </div>

              </div>

              <div className="space-y-3 text-gray-600 text-sm">

                <div className="flex items-center gap-2">
                  <MapPin size={17} />
                  {job.location}
                </div>

                <div className="flex items-center gap-2">
                  <Briefcase size={17} />
                  {job.employmentType}
                </div>

                <div className="flex items-center gap-2">
                  <Banknote size={17} />
                  ₺{" "}
                  {Number(job.salary || 0).toLocaleString(
                    "tr-TR"
                  )}
                </div>

              </div>

              <div className="flex justify-between items-center mt-6">

                {job.category && (
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
                    {job.category}
                  </span>
                )}

                <Link
                  to={`/jobs/${job._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Detay
                </Link>

              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  );
};

export default FeaturedJobs;