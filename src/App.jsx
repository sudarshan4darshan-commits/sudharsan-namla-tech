import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import HotelCard from "./components/hotelcard";
import "./App.css";
import { useDispatch } from "react-redux";
import { fetchHotels } from "./redux/hotelslice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  const hotels = useSelector(
    (state) => state.hotels.hotels
  );

  const [searchText, setSearchText] = useState("");

  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const handleToast = (e) => {
      setToastMessage(e.detail);

      setTimeout(() => {
        setToastMessage("");
      }, 2500);
    };

    window.addEventListener("showToast", handleToast);

    return () => {
      window.removeEventListener("showToast", handleToast);
    };
  }, []);

  const [showFilter, setShowFilter] = useState(false);

  const [selectedRanges, setSelectedRanges] =
    useState([]);

  const [appliedRanges, setAppliedRanges] =
    useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const hotelsPerPage = 12;

  const priceRanges = [
    {
      id: "under1000",
      label: "Under ₹1,000",
      min: 0,
      max: 999,
    },
    {
      id: "1000-2000",
      label: "₹1,000 - ₹2,000",
      min: 1000,
      max: 2000,
    },
    {
      id: "2000-3000",
      label: "₹2,000 - ₹3,000",
      min: 2000,
      max: 3000,
    },
    {
      id: "3000-4000",
      label: "₹3,000 - ₹4,000",
      min: 3000,
      max: 4000,
    },
    {
      id: "4000-5000",
      label: "₹4,000 - ₹5,000",
      min: 4000,
      max: 5000,
    },
    {
      id: "5000plus",
      label: "₹5,000+",
      min: 5000,
      max: Infinity,
    },
  ];

  const handleRangeChange = (rangeId) => {
    setSelectedRanges((previousRanges) => {
      if (previousRanges.includes(rangeId)) {
        return previousRanges.filter(
          (id) => id !== rangeId
        );
      }

      return [
        ...previousRanges,
        rangeId,
      ];
    });
  };

  const handleApplyFilter = () => {
    setAppliedRanges(selectedRanges);
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleClearFilter = () => {
    setSelectedRanges([]);
    setAppliedRanges([]);
    setCurrentPage(1);
    setShowFilter(false);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const filteredHotels = hotels.filter((hotel) => {
    const search = searchText
      .toLowerCase()
      .trim();

    const hotelName = hotel.name
      ? hotel.name.toLowerCase()
      : "";

    const matchesSearch =
      hotelName.includes(search);

    if (appliedRanges.length === 0) {
      return matchesSearch;
    }

    const matchesPrice =
      appliedRanges.some((rangeId) => {
        const range = priceRanges.find(
          (item) => item.id === rangeId
        );

        if (!range) {
          return false;
        }

        const hotelPrice = Number(
          hotel.price
        );

        return (
          hotelPrice >= range.min &&
          hotelPrice <= range.max
        );
      });

    return (
      matchesSearch &&
      matchesPrice
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredHotels.length /
        hotelsPerPage
    )
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const startIndex =
    (currentPage - 1) *
    hotelsPerPage;

  const currentHotels =
    filteredHotels.slice(
      startIndex,
      startIndex + hotelsPerPage
    );

  const goToPage = (pageNumber) => {
    if (
      pageNumber < 1 ||
      pageNumber > totalPages
    ) {
      return;
    }

    setCurrentPage(pageNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const previousPage = () => {
    goToPage(currentPage - 1);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  return (
    <>
      <h1 className="heading">
        HOTEL LIST
      </h1>

      <div className="hotel-tools">

        <h2>HOTELS:</h2>

        <div className="actions">

          <Link
            to="/add-hotel"
            className="add-btn"
          >
            ＋ Add Hotel
          </Link>

          <div className="filter-container">

            <button
              className="filter-btn"
              onClick={() =>
                setShowFilter(
                  (previous) =>
                    !previous
                )
              }
            >
              <span className="filter-icon">
                ☷
              </span>

              Filter
            </button>

            {showFilter && (
              <div className="filter-options">

                {priceRanges.map(
                  (range) => (
                    <label
                      key={range.id}
                      className="filter-option"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRanges.includes(
                          range.id
                        )}
                        onChange={() =>
                          handleRangeChange(
                            range.id
                          )
                        }
                      />

                      <span>
                        {range.label}
                      </span>
                    </label>
                  )
                )}

                <button
                  className="apply-filter-btn"
                  onClick={
                    handleApplyFilter
                  }
                >
                  Filter
                </button>

                <button
                  className="clear-filter-btn"
                  onClick={
                    handleClearFilter
                  }
                >
                  Clear
                </button>

              </div>
            )}

          </div>

          <div className="search-box">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search hotels..."
              value={searchText}
              onChange={handleSearch}
            />

          </div>

        </div>
      </div>

      <div className="hotel-grid">

        {currentHotels.length > 0 ? (

          currentHotels.map(
            (hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
              />
            )
          )

        ) : (

          <div className="no-hotels">

            <h3>
              No hotels found
            </h3>

            <p>
              Try another hotel name
              or price range.
            </p>

          </div>

        )}

      </div>

      {filteredHotels.length >
        hotelsPerPage && (
        <div className="pagination">

          <button
            className="page-arrow"
            onClick={previousPage}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {Array.from(
            {
              length: totalPages,
            },
            (_, index) => {
              const pageNumber =
                index + 1;

              return (
                <button
                  key={pageNumber}
                  className={
                    currentPage ===
                    pageNumber
                      ? "page-number active"
                      : "page-number"
                  }
                  onClick={() =>
                    goToPage(
                      pageNumber
                    )
                  }
                >
                  {pageNumber}
                </button>
              );
            }
          )}

          <button
            className="page-arrow"
            onClick={nextPage}
            disabled={
              currentPage ===
              totalPages
            }
          >
            ›
          </button>

        </div>
      )}

      {filteredHotels.length > 0 && (
        <div className="page-info">
          Page {currentPage} of{" "}
          {totalPages}
        </div>
      )}

      {toastMessage && (
        <div className="toast">
          ✓ {toastMessage}
        </div>
      )}
    </>
  );
}

export default App;