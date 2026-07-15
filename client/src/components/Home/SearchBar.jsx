import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="max-w-5xl mx-auto -mt-12 bg-white shadow-xl rounded-2xl p-6">

      <div className="grid md:grid-cols-4 gap-4">

        <input
          className="border rounded-lg p-3"
          placeholder="Pozisyon"
        />

        <input
          className="border rounded-lg p-3"
          placeholder="Şehir"
        />

        <select className="border rounded-lg p-3">

          <option>Full Time</option>

          <option>Part Time</option>

          <option>Remote</option>

        </select>

        <button className="bg-blue-600 text-white rounded-lg flex justify-center items-center gap-2">

          <Search size={18} />

          Ara

        </button>

      </div>

    </div>
  );
};

export default SearchBar;