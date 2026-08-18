import { useEffect, useState } from "react";
import api from "../../api/axios";

const TopCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const res = await api.get("/jobs", {
        params: {
          page: 1,
          limit: 50,
        },
      });

      const jobs = res.data.jobs || [];

      const companyMap = new Map();

      jobs.forEach((job) => {
        if (!job.company) return;

        if (!companyMap.has(job.company)) {
          companyMap.set(job.company, {
            name: job.company,
            logo: job.companyLogo,
            jobs: 1,
          });
        } else {
          companyMap.get(job.company).jobs += 1;
        }
      });

      const companyList = Array.from(
        companyMap.values()
      )
        .sort((a, b) => b.jobs - a.jobs)
        .slice(0, 6);

      setCompanies(companyList);
    } catch (error) {
      console.error(
        "Şirketler yüklenemedi:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">

      <div className="text-center mb-10">

        <h2 className="text-3xl font-bold">
          Öne Çıkan Şirketler
        </h2>

        <p className="text-gray-500 mt-2">
          Kariyer fırsatları sunan şirketleri keşfedin.
        </p>

      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow p-6 animate-pulse"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto" />

                <div className="h-4 bg-gray-200 rounded mt-4" />

                <div className="h-3 bg-gray-200 rounded mt-2" />
              </div>
            )
          )}

        </div>
      ) : companies.length === 0 ? (
        <div className="text-center text-gray-500">
          Henüz şirket bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

          {companies.map((company) => (
            <div
              key={company.name}
              className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition"
            >

              <img
                src={
                  company.logo ||
                  "https://placehold.co/80x80?text=Logo"
                }
                alt={company.name}
                className="w-16 h-16 rounded-xl object-cover border mx-auto"
              />

              <h3 className="font-semibold mt-4 truncate">
                {company.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {company.jobs} ilan
              </p>

            </div>
          ))}

        </div>
      )}

    </section>
  );
};

export default TopCompanies;