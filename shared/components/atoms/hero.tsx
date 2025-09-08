

import React from "react";
import Link from "next/link";

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({
  title = "Find Your Dream Home",
  subtitle = "Discover amazing properties for sale and rent in your area.",
  ctaText = "Post a Listing",
  ctaHref = "/dashboard/properties/new",
  showSearch = true,
  onSearch,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      // Default behavior: navigate to search page
      window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section
      className={`w-full bg-gradient-to-br from-blue-50 to-white py-16 md:py-24 flex flex-col items-center text-center ${className}`}
    >
      <div className="max-w-4xl px-6 md:px-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        
        {showSearch && (
          <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto">
            <div className="flex rounded-lg shadow-lg bg-white p-2">
              <input
                type="text"
                placeholder="Search by location, property type, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 text-gray-700 bg-transparent outline-none"
              />
              <button
                type="submit"
                className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition"
              >
                Search
              </button>
            </div>
          </form>
        )}
        
        <Link
          href={ctaHref}
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  );

};

export default Hero;

