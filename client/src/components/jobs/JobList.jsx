import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import JobSkeleton from "./JobSkeleton";
import JobCard from "./JobCard";

import api from "../../api/axios";

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
    limit,
  } = useSelector((state) => state.jobs);

  useEffect(() => {
    loadJobs();
  }, [filters, page]);

  const loadJobs = async () => {
    try {
      dispatch(fetchStart());

      const res = await api.get("/jobs", {
        params: {
          ...filters,
          page,
          limit,
        },
      });

      dispatch(fetchSuccess(res.data));
    } catch (err) {
      dispatch(
        fetchFail(
          err.response?.data?.message ||
            err.message ||
            "İlanlar yüklenemedi."
        )
      );
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <JobSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Hata
  if (!loading && jobs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center">
        <h2 className="text-xl font-semibold">
          İlan bulunamadı
        </h2>

        <p className="text-gray-500 mt-2">
          Arama veya filtre kriterlerini değiştirmeyi
          deneyin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
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