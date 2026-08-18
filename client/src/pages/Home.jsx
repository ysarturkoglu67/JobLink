import { useState } from "react";
import { useDispatch } from "react-redux";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import SearchBar from "../components/home/SearchBar";
import FilterSidebar from "../components/home/FilterSidebar";
import JobList from "../components/jobs/JobList";
import Pagination from "../components/common/Pagination";
import Stats from "../components/home/Stats";
import TopCompanies from "../components/home/TopCompanies";
import Footer from "../components/layout/Footer";
import PopularCategories from "../components/home/PopularCategories";
import FeaturedJobs from "../components/home/FeaturedJobs";

import { changePage } from "../redux/slices/jobSlice";

const Home = () => {
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    employmentType: "",
    category: "",
    experience: "",
    minSalary: "",
    maxSalary: "",
  });

  // Arama
  const handleSearch = (searchFilters) => {
    setFilters({
      keyword: searchFilters.keyword || "",
      location: searchFilters.location || "",
      employmentType: searchFilters.employmentType || "",
      category: "",
      experience: "",
      minSalary: "",
      maxSalary: "",
    });

    dispatch(changePage(1));
  };

  // Sidebar filtreleri
  const handleFilter = (filterValues) => {
    setFilters({
      keyword: "",
      location: filterValues.location || "",
      employmentType: filterValues.employmentType || "",
      category: filterValues.category || "",
      experience: filterValues.experience || "",
      minSalary: filterValues.minSalary || "",
      maxSalary: filterValues.maxSalary || "",
    });

    dispatch(changePage(1));
  };

  return (
    <>
      <Navbar />

      <Hero />

      {/* Arama */}
      <SearchBar onSearch={handleSearch} />

      {/* İstatistikler */}
      <Stats />

      {/* Popüler kategoriler */}
      <PopularCategories />

      {/* Öne çıkan ilanlar */}
      <FeaturedJobs />

      {/* İlanlar + Filtreler */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div>
            <FilterSidebar onFilter={handleFilter} />
          </div>

          {/* İlan Listesi */}
          <div className="lg:col-span-3">

            <JobList filters={filters} />

            <Pagination />

          </div>
        </div>
      </section>

      {/* Firmalar */}
      <TopCompanies />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Home;