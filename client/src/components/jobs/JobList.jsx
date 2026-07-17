import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import JobSkeleton from "./JobSkeleton";

import api from "../../api/axios";

import JobCard from "./JobCard";

import {
  fetchStart,
  fetchSuccess,
  fetchFail,
} from "../../redux/slices/jobSlice";

const JobList = ({ filters }) => {
  const dispatch = useDispatch();

  const {
  jobs,
  loading,
  page,
  totalPages,
} = useSelector((state) => state.jobs);

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const loadJobs = async () => {
    try {
      dispatch(fetchStart());

      const res = await api.get("/jobs", {
      params: {
     ...filters,
     page,
     limit: 6,
   },
  });

      dispatch(fetchSuccess(res.data));
    } catch (err) {
      dispatch(fetchFail(err.message));
    }
  };

  if (loading) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <JobSkeleton key={index} />
      ))}
    </div>
  );
}

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">
          İlan bulunamadi
        </h2>

        <p className="text-gray-500 mt-2">
          Arama kriterlerini değiştirmeyi deneyin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
        />
      ))}
    </div>
  );
};

export default JobList;