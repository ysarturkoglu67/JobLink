import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    employmentType: "",
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto -mt-10 bg-white rounded-2xl shadow-xl p-6"
    >
      <div className="grid md:grid-cols-4 gap-4">

        <input
          name="keyword"
          placeholder="Pozisyon"
          value={filters.keyword}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <input
          name="location"
          placeholder="Şehir"
          value={filters.location}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <select
          name="employmentType"
          value={filters.employmentType}
          onChange={handleChange}
          className="border rounded-lg p-3"
        >
          <option value="">Çalışma Tipi</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <button className="bg-blue-600 text-white rounded-lg">
          Ara
        </button>

      </div>
    </form>
  );
};

export default SearchBar;