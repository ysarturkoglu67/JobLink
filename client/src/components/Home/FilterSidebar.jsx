import { useState } from "react";

const FilterSidebar = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    location: "",
    employmentType: "",
    minSalary: "",
    maxSalary: "",
    experience: "",
    category: "",
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onFilter({
      ...filters,
      minSalary: filters.minSalary
        ? Number(filters.minSalary)
        : "",
      maxSalary: filters.maxSalary
        ? Number(filters.maxSalary)
        : "",
    });
  };

  const clearFilters = () => {
    const emptyFilters = {
      location: "",
      employmentType: "",
      minSalary: "",
      maxSalary: "",
      experience: "",
      category: "",
    };

    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-6">
        Filtreler
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Şehir */}

        <div>
          <label className="block mb-2 font-medium">
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
          <label className="block mb-2 font-medium">
            Çalışma Tipi
          </label>

          <select
            name="employmentType"
            value={filters.employmentType}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="">
              Tümü
            </option>

            <option value="Full Time">
              Full Time
            </option>

            <option value="Part Time">
              Part Time
            </option>

            <option value="Remote">
              Remote
            </option>

            <option value="Hybrid">
              Hybrid
            </option>

            <option value="Internship">
              Internship
            </option>
          </select>
        </div>

        {/* Kategori */}

        <div>
          <label className="block mb-2 font-medium">
            Kategori
          </label>

          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="">
              Tümü
            </option>

            <option value="Yazılım">
              Yazılım
            </option>

            <option value="Frontend">
              Frontend
            </option>

            <option value="Backend">
              Backend
            </option>

            <option value="Full Stack">
              Full Stack
            </option>

            <option value="Mobil">
              Mobil
            </option>

            <option value="DevOps">
              DevOps
            </option>

            <option value="Yapay Zeka">
              Yapay Zeka
            </option>

            <option value="Veri Bilimi">
              Veri Bilimi
            </option>

            <option value="Siber Güvenlik">
              Siber Güvenlik
            </option>

            <option value="ERP">
              ERP
            </option>

            <option value="Tasarım">
              Tasarım
            </option>

            <option value="Pazarlama">
              Pazarlama
            </option>

            <option value="Muhasebe">
              Muhasebe
            </option>

            <option value="İnsan Kaynakları">
              İnsan Kaynakları
            </option>
          </select>
        </div>

        {/* Deneyim */}

        <div>
          <label className="block mb-2 font-medium">
            Deneyim
          </label>

          <select
            name="experience"
            value={filters.experience}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="">
              Tümü
            </option>

            <option value="Junior">
              Junior
            </option>

            <option value="Mid">
              Mid
            </option>

            <option value="Senior">
              Senior
            </option>
          </select>
        </div>

        {/* Minimum Maaş */}

        <div>
          <label className="block mb-2 font-medium">
            Minimum Maaş
          </label>

          <input
            type="number"
            name="minSalary"
            placeholder="40000"
            value={filters.minSalary}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Maximum Maaş */}

        <div>
          <label className="block mb-2 font-medium">
            Maximum Maaş
          </label>

          <input
            type="number"
            name="maxSalary"
            placeholder="100000"
            value={filters.maxSalary}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Butonlar */}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition"
        >
          Filtrele
        </button>

        <button
          type="button"
          onClick={clearFilters}
          className="w-full border border-gray-300 text-gray-700 rounded-lg py-3 hover:bg-gray-100 transition"
        >
          Filtreleri Temizle
        </button>
      </form>
    </div>
  );
};

export default FilterSidebar;