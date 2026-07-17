import { useDispatch, useSelector } from "react-redux";
import { changePage } from "../../redux/slices/jobSlice";

const Pagination = () => {
  const dispatch = useDispatch();

  const { page, totalPages } = useSelector(
    (state) => state.jobs
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-10">
      <button
        disabled={page === 1}
        onClick={() => dispatch(changePage(page - 1))}
        className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
      >
        Önceki
      </button>

      <span className="font-semibold">
        {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => dispatch(changePage(page + 1))}
        className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      >
        Sonraki
      </button>
    </div>
  );
};

export default Pagination;