import { useCallback, useState } from "react";
import Listing from "./components/Listings/index";
import SidebarFilters from "./components/SidebarFilters/index";
import Pagination from "./components/pagination/Pagination";
import { useSearchProperties } from "./services/SearchProperties.services";

const BrowsePage = () => {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  const handleSortChange = (sortOption) => {
    let orderingValue = "newest";

    if (sortOption === "price_asc") {
      orderingValue = "price_low";
    } else if (sortOption === "price_desc") {
      orderingValue = "price_high";
    }

    setFilters((prev) => ({
      ...prev,
      ordering: orderingValue,
    }));
    setPage(1);
  };

  const {
    data: result,
    isLoading,
    isError,
  } = useSearchProperties({
    ...filters,
    page,
    location: filters.location || "",
    type: filters.rentType || "", // Use correctly
    furnished: filters.furnished || "",
    propertyTypes: filters.propertyTypes || [],
    min_price: filters.price ? filters.price - 10000 : undefined,
    max_price: filters.price || undefined,
  });

  const activeProperties = (result?.results || result || []).filter(
    (property) => property.status === "Active"
  );

  return (
    <div className="bg-[#0f1115] text-white min-h-screen p-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-1/4">
          <SidebarFilters onFiltersChange={handleFiltersChange} />
        </aside>
        <main className="w-full md:w-3/4 space-y-6">
          {isLoading ? (
            <p>Loading properties...</p>
          ) : isError ? (
            <p className="text-red-500">Error fetching properties.</p>
          ) : (
            <>
              <Listing
                properties={activeProperties}
                onSortChange={handleSortChange}
              />
              <Pagination currentPage={page} onPageChange={setPage} totalPages={10} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default BrowsePage;
