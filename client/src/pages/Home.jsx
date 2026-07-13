import { useEffect, useState } from "react";
import api from "../api/axios";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/common/Hero";
import JobCard from "../components/jobs/JobCard";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs");

      setJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <>
      <Navbar />

      <Hero />

      <div className="max-w-7xl mx-auto py-10 px-6">

        <h2 className="text-3xl font-bold mb-8">
          Güncel İş İlanlari
        </h2>

        {loading ? (
          <p>Yükleniyor...</p>
        ) : jobs.length === 0 ? (
          <p>Henüz ilan bulunmuyor.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;