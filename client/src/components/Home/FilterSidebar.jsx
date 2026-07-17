const FilterSidebar = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">

      <h2 className="text-xl font-bold mb-6">
        Filtreler
      </h2>

      <div className="space-y-5">

        <div>
          <label className="block mb-2 font-medium">
            Şehir
          </label>

          <input
            type="text"
            placeholder="İstanbul"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Çalişma Tipi
          </label>

          <select className="w-full border rounded-lg p-3">
            <option>Tümü</option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Remote</option>
            <option>Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Minimum Maaş
          </label>

          <input
            type="number"
            placeholder="40000"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700">
          Filtrele
        </button>

      </div>

    </div>
  );
};

export default FilterSidebar;