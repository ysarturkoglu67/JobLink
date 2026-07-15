import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import SearchBar from "../components/home/SearchBar";
import FilterSidebar from "../components/home/FilterSidebar";
import JobList from "../components/jobs/JobList";

const Home = () => {
  return (
    <>
      <Navbar />

      <Hero />

      <SearchBar />

      <section className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid lg:grid-cols-4 gap-8">

          <div>
            <FilterSidebar />
          </div>

          <div className="lg:col-span-3">
            <JobList />
          </div>

        </div>

      </section>
    </>
  );
};

export default Home;