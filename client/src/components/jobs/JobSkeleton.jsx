const JobSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">

      <div className="h-6 bg-gray-200 rounded w-2/3"></div>

      <div className="h-4 bg-gray-200 rounded w-1/2 mt-4"></div>

      <div className="space-y-3 mt-8">

        <div className="h-4 bg-gray-200 rounded"></div>

        <div className="h-4 bg-gray-200 rounded"></div>

        <div className="h-4 bg-gray-200 rounded"></div>

      </div>

      <div className="h-10 bg-gray-200 rounded mt-8"></div>

    </div>
  );
};

export default JobSkeleton;