const categories = [
  {
    name: "Yazılım",
    icon: "💻",
  },
  {
    name: "Frontend",
    icon: "🎨",
  },
  {
    name: "Backend",
    icon: "⚙️",
  },
  {
    name: "Full Stack",
    icon: "🚀",
  },
  {
    name: "Mobil",
    icon: "📱",
  },
  {
    name: "DevOps",
    icon: "☁️",
  },
  {
    name: "Yapay Zeka",
    icon: "🤖",
  },
  {
    name: "Veri Bilimi",
    icon: "📊",
  },
];

const PopularCategories = ({ onFilter }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">

      <div className="text-center mb-10">

        <h2 className="text-3xl font-bold">
          Popüler Kategoriler
        </h2>

        <p className="text-gray-500 mt-2">
          Kariyerinize uygun iş ilanlarını keşfedin.
        </p>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() =>
              onFilter({
                category: category.name,
              })
            }
            className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg hover:-translate-y-1 transition"
          >

            <div className="text-4xl mb-4">
              {category.icon}
            </div>

            <h3 className="font-semibold text-lg">
              {category.name}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              İş ilanlarını gör
            </p>

          </button>
        ))}

      </div>

    </section>
  );
};

export default PopularCategories;