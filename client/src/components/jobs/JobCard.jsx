import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Banknote,
  Clock3,
} from "lucide-react";

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border">

      <div className="flex justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            {job.title}
          </h2>

          <p className="text-gray-500 mt-1">
            {job.company}
          </p>

        </div>

        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
          Yeni
        </span>

      </div>

      <div className="mt-6 space-y-3">

        <p className="flex items-center gap-2">
          <MapPin size={18} />
          {job.location}
        </p>

        <p className="flex items-center gap-2">
          <Briefcase size={18} />
          {job.employmentType}
        </p>

        <p className="flex items-center gap-2">
          <Banknote size={18} />
          ₺ {job.salary}
        </p>

        <p className="flex items-center gap-2">
          <Clock3 size={18} />
          {new Date(job.createdAt).toLocaleDateString("tr-TR")}
        </p>

      </div>

      <div className="flex gap-2 mt-6 flex-wrap">

        <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">
          React
        </span>

        <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">
          Node.js
        </span>

        <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">
          MongoDB
        </span>

      </div>

      <Link
        to={`/jobs/${job._id}`}
        className="mt-6 w-full block text-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3"
      >
        İlan Detayini Gör
      </Link>

    </div>
  );
};

export default JobCard;