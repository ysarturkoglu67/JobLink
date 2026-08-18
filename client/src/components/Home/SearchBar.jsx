import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    employmentType: "",
  });

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSearch({
      ...filters,
    });
  };

  const clearSearch = () => {
    const emptyFilters = {
      keyword: "",
      location: "",
      employmentType: "",
    };

    setFilters(emptyFilters);
    onSearch(emptyFilters);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg border p-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Pozisyon / Anahtar Kelime */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Pozisyon
            </label>

            <input
              type="text"
              name="keyword"
              placeholder="Frontend Developer"
              value={filters.keyword}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Şehir */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Şehir
            </label>

            <input
              type="text"
              name="location"
              placeholder="İstanbul"
              value={filters.location}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Çalışma Tipi */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Çalışma Tipi
            </label>

            <select
              name="employmentType"
              value={filters.employmentType}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tümü</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Ara */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold transition"
            >
              Ara
            </button>
          </div>

        </div>

        {/* Temizle */}
        {(filters.keyword ||
          filters.location ||
          filters.employmentType) && (
          <div className="mt-4 text-right">
            <button
              type="button"
              onClick={clearSearch}
              className="text-sm text-gray-500 hover:text-blue-600"
            >
              Aramayı Temizle
            </button>
          </div>
        )}
      </form>
    </section>
  );
};

export default SearchBar;