import { useEffect, useState } from "react";
import api from "../../api/axios";
import JobCard from "../../components/jobs/JobCard";

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      const res = await api.get("/auth/saved-jobs");
      setJobs(res.data.jobs);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">
        Favori İlanlarım
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;