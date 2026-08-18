import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  Building2,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white">

      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">

        <div>

          <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
            🚀 Türkiye'nin Yeni Kariyer Platformu
          </span>

          <h1 className="text-6xl font-extrabold leading-tight mt-8">
            Hayalindeki
            <br />
            işi bugün bul.
          </h1>

          <p className="text-blue-100 text-xl mt-8 leading-9">
            Binlerce şirket, on binlerce ilan.
            Kariyer yolculuğuna JobLink ile başla.
          </p>

          <div className="bg-white rounded-2xl p-3 mt-10 flex flex-col lg:flex-row gap-3 shadow-2xl">

            <div className="flex items-center flex-1 border rounded-xl px-4">

              <Search className="text-gray-400" size={20} />

              <input
                className="flex-1 p-3 outline-none text-black"
                placeholder="Pozisyon ara..."
              />

            </div>

            <div className="flex items-center flex-1 border rounded-xl px-4">

              <MapPin className="text-gray-400" size={20} />

              <input
                className="flex-1 p-3 outline-none text-black"
                placeholder="Şehir"
              />

            </div>

            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 px-8 rounded-xl flex items-center justify-center font-semibold"
            >
              Ara
            </Link>

          </div>

          <div className="flex flex-wrap gap-3 mt-8">

            {[
              "React",
              "Node.js",
              ".NET",
              "Java",
              "Flutter",
              "Python",
            ].map((item) => (
              <span
                key={item}
                className="bg-white/20 px-4 py-2 rounded-full"
              >
                {item}
              </span>
            ))}

          </div>

        </div>

        <div>

          <div className="grid grid-cols-2 gap-6">

            <div className="bg-white rounded-2xl p-8 text-center shadow-xl">

              <Briefcase
                className="mx-auto text-blue-600"
                size={45}
              />

              <h2 className="text-4xl font-bold text-black mt-4">
                10.000+
              </h2>

              <p className="text-gray-500 mt-2">
                Aktif İlan
              </p>

            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-xl">

              <Building2
                className="mx-auto text-green-600"
                size={45}
              />

              <h2 className="text-4xl font-bold text-black mt-4">
                5.000+
              </h2>

              <p className="text-gray-500 mt-2">
                Şirket
              </p>

            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-xl">

              <Users
                className="mx-auto text-purple-600"
                size={45}
              />

              <h2 className="text-4xl font-bold text-black mt-4">
                25.000+
              </h2>

              <p className="text-gray-500 mt-2">
                Aday
              </p>

            </div>

            <div className="bg-white rounded-2xl p-8 text-center shadow-xl">

              <Search
                className="mx-auto text-orange-500"
                size={45}
              />

              <h2 className="text-4xl font-bold text-black mt-4">
                1M+
              </h2>

              <p className="text-gray-500 mt-2">
                Başvuru
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;