import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <h2 className="text-center mt-20">Yükleniyor...</h2>;

  if (!job)
    return (
      <h2 className="text-center mt-20">
        İlan bulunamadi.
      </h2>
    );
    const applyJob = async () => {
  try {
    await api.post("/applications", {
      jobId: job._id,
      coverLetter,
    });

    toast.success("Başvurunuz başariyla gönderildi.");

    setCoverLetter("");
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Başvuru başarisiz."
    );
  }
};

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">

      <h1 className="text-4xl font-bold">
        {job.title}
      </h1>

      <p className="text-xl mt-3 text-gray-600">
        {job.company}
      </p>

      <div className="flex gap-5 mt-6">

        <span>📍 {job.location}</span>

        <span>💼 {job.employmentType}</span>

        <span className="font-bold text-green-600">
          ₺ {job.salary}
        </span>

      </div>

      <div className="mt-10">

        <h2 className="text-2xl font-bold mb-4">
          İş Açiklamasi
        </h2>

        <p className="text-gray-700 leading-8">
          {job.description}
        </p>

      </div>
      <div className="mt-10">
  <label className="block mb-2 text-lg font-semibold">
    Ön Yazi
  </label>

  <textarea
    rows="6"
    value={coverLetter}
    onChange={(e) => setCoverLetter(e.target.value)}
    placeholder="Kendinizi kisaca tanitin..."
    className="w-full border rounded-lg p-4"
  />
</div>

      <button
        className="mt-10 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
      >
       <button
  onClick={applyJob}
  className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg"
>
  Başvur
</button>
      </button>

    </div>
  );
};

export default JobDetails;