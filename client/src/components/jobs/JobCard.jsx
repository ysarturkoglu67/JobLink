import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition">

      <h2 className="text-xl font-bold">
        {job.title}
      </h2>

      <p className="text-gray-600 mt-2">
        {job.company}
      </p>

      <p className="mt-2">
        📍 {job.location}
      </p>

      <p>
        💼 {job.employmentType}
      </p>

      <p className="font-semibold mt-2 text-green-600">
        ₺ {job.salary}
      </p>

      <Link
        to={`/jobs/${job._id}`}
        className="inline-block mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Detaylari Gör
      </Link>

    </div>
  );
};

export default JobCard;