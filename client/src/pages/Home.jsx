import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import SearchBar from "../components/home/SearchBar";
import FilterSidebar from "../components/home/FilterSidebar";
import JobList from "../components/jobs/JobList";
import Pagination from "../components/common/Pagination";

const Home = () => {

  const [filters, setFilters] = useState({});

  return (
    <>
      <Navbar />

      <Hero />

      <SearchBar onSearch={setFilters} />

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-4 gap-8">

          <div>
            <FilterSidebar />
          </div>

          <div className="lg:col-span-3">
            <JobList filters={filters} />
            <Pagination />
          </div>

        </div>
      </section>
    </>
  );
};

export default Home;