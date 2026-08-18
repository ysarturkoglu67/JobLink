import { useDispatch, useSelector } from "react-redux";
import { changePage } from "../../redux/slices/jobSlice";

const Pagination = () => {
  const dispatch = useDispatch();

  const { page, totalPages } = useSelector(
    (state) => state.jobs
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-8">

      <button
        type="button"
        disabled={page === 1}
        onClick={() => dispatch(changePage(page - 1))}
        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Önceki
      </button>

      <span className="font-semibold text-gray-700">
        Sayfa {page} / {totalPages}
      </span>

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => dispatch(changePage(page + 1))}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sonraki
      </button>

    </div>
  );
};

export default Pagination;