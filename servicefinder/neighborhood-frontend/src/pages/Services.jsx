import React, { useEffect, useState } from "react";
import { getAllServices } from "../api/userApi"; // fetches ServiceResponseDTOs
import { smartSearch } from "../api/aiApi"; // AI smart search
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaStar, FaTools, FaWrench, FaCog, FaCogs, FaHardHat } from "react-icons/fa";

// Star Rating Display Component
const StarRatingDisplay = ({ rating, reviewCount }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  // If no reviews, display 0 stars by default
  const displayRating = rating > 0 ? rating : 0;
  const displayReviewCount = reviewCount !== undefined ? reviewCount : 0;

  return (
    <div className="d-flex align-items-center justify-content-center my-2">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="star-icon text-warning" />
      ))}
      {halfStar && <FaStar key="half" className="star-icon text-warning-half" />}
      {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
        <FaStar key={`empty-${i}`} className="star-icon text-muted" />
      ))}
      <span className="ms-2 text-muted-dark fw-medium">
        {displayRating.toFixed(1)} ({displayReviewCount} reviews)
      </span>
    </div>
  );
};

// ServiceIcon Component
const ServiceIcon = ({ serviceName }) => {
  const icons = [FaTools, FaWrench, FaCog, FaCogs, FaHardHat];
  const IconComponent = icons[serviceName.length % icons.length];
  return <IconComponent size={35} color="#6c5ce7" />;
};

const SEARCH_EXAMPLES = ["my tap is leaking", "fan not working", "need house cleaning"];

const Services = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- AI smart search state ---
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null); // null = not searching
  const [searchMode, setSearchMode] = useState(null); // "ai" or "keyword"
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    getAllServices()
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
        setLoading(false);
      });
  }, []);

  const runSearch = async (text) => {
    const q = (typeof text === "string" ? text : query).trim();
    if (!q) {
      setSearchResults(null);
      setSearchMode(null);
      return;
    }
    setQuery(q);
    setSearching(true);
    setError(null);
    try {
      const data = await smartSearch(q);
      setSearchResults(data.services);
      setSearchMode(data.mode);
    } catch (err) {
      console.error("Smart search failed:", err);
      setError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSearchResults(null);
    setSearchMode(null);
    setError(null);
  };

  // Show search results when searching, otherwise all services
  const displayedServices = searchResults ?? services;

  return (
    <>
      <Navbar />
      <div className="modern-services-page">
        <header className="hero-section text-center py-5 mb-5">
          <div className="container">
            <h1 className="display-4 fw-bold text-white mb-3">Discover Our Premium Services</h1>
            <p className="lead text-white-50">
              Tailored solutions designed to meet your unique needs and exceed expectations.
            </p>

            {/* AI Smart Search */}
            <div className="mx-auto mt-4" style={{ maxWidth: 650 }}>
              <div className="input-group input-group-lg">
                <input
                  className="form-control"
                  placeholder='Describe your problem, e.g. "my tap is leaking"'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                />
                <button
                  className="btn btn-light fw-semibold"
                  onClick={() => runSearch()}
                  disabled={searching}
                >
                  {searching ? "Searching..." : "🔍 Smart Search"}
                </button>
                {searchResults !== null && (
                  <button className="btn btn-outline-light" onClick={clearSearch}>
                    ✕ Clear
                  </button>
                )}
              </div>
              <div className="mt-3">
                {SEARCH_EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    className="btn btn-sm btn-outline-light me-2 mb-1"
                    onClick={() => runSearch(ex)}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="container py-5">
          {searchMode === "keyword" && searchResults !== null && (
            <div className="alert alert-warning text-center">
              AI search is unavailable, showing keyword results instead.
            </div>
          )}
          {searchMode === "ai" && searchResults !== null && searchResults.length > 0 && (
            <p className="text-center text-muted-dark mb-4">
              ✨ Showing AI-matched results for "{query}"
            </p>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading services...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          ) : displayedServices.length === 0 ? (
            <p className="text-center fs-5 text-muted-dark">
              {searchResults !== null
                ? "No matching services found. Try describing your problem differently."
                : "No services available right now. Please check back soon!"}
            </p>
          ) : (
            <div className="row g-4 justify-content-center">
              {displayedServices.map((service) => (
                <div className="col-md-6 col-lg-4 d-flex" key={service.id}>
                  <div className="service-card-modern flex-fill d-flex flex-column shadow-sm border-0 p-4">
                    <div className="icon-wrapper-modern mb-3 mx-auto">
                      <ServiceIcon serviceName={service.name} />
                    </div>
                    <h5 className="fw-bold text-center mb-0 text-dark">{service.name}</h5>
                    <StarRatingDisplay
                      rating={service.averageRating || 0}
                      reviewCount={service.totalReviews || 0}
                    />
                    <p className="text-muted text-center flex-grow-1 service-description-modern mt-2">
                      {service.description ||
                        "A comprehensive service offering premium quality and value."}
                    </p>
                    <div className="d-flex justify-content-between align-items-center pt-3 mt-auto">
                      <span className="fw-bold text-purple fs-5">Price: ${service.price}</span>
                      <button
                        className="btn btn-purple-outline btn-hover-effect"
                        onClick={() =>
                          navigate("/booking", { state: { serviceId: service.id } })
                        }
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />

      {/* Custom CSS for Modern Look */}
      <style jsx="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap');

        body {
          background-color: #f8faff;
        }

        .hero-section {
          background: linear-gradient(135deg, #6c5ce7, #8e44ad);
          color: white;
          padding: 80px 0;
          border-bottom-left-radius: 50px;
          border-bottom-right-radius: 50px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        }

        .hero-section h1 {
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
        }

        .hero-section p {
          font-family: 'Lato', sans-serif;
          max-width: 700px;
          margin: 0 auto;
          font-size: 1.15rem;
        }

        .modern-services-page {
          padding-bottom: 5rem;
        }

        .service-card-modern {
          background: white;
          border-radius: 20px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 350px;
          border: 1px solid transparent;
        }

        .service-card-modern:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border-color: #a78bfa;
        }

        .icon-wrapper-modern {
          background: linear-gradient(45deg, #e0e7ff, #f3e8ff);
          border-radius: 50%;
          padding: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 70px;
          height: 70px;
          margin-bottom: 15px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
        }
        .icon-wrapper-modern svg {
          transition: transform 0.3s ease;
        }
        .service-card-modern:hover .icon-wrapper-modern svg {
          transform: scale(1.1);
        }

        .service-card-modern h5 {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          color: #333;
          font-size: 1.4rem;
        }

        .service-description-modern {
          font-family: 'Lato', sans-serif;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #555;
          margin-bottom: 15px;
        }

        .text-purple {
          color: #6c5ce7 !important;
          font-family: 'Poppins', sans-serif;
        }

        .btn-purple-outline {
          color: #6c5ce7;
          border-color: #6c5ce7;
          background-color: transparent;
          padding: 10px 25px;
          border-radius: 30px;
          font-weight: 600;
          transition: all 0.3s ease;
          letter-spacing: 0.03em;
        }

        .btn-purple-outline:hover,
        .btn-purple-outline:focus {
          background-color: #6c5ce7;
          color: white;
          box-shadow: 0 6px 15px rgba(108, 92, 231, 0.4);
          transform: translateY(-3px);
          border-color: #6c5ce7;
        }

        /* Star Rating Styles */
        .star-icon {
          font-size: 1.1rem;
          margin: 0 1px;
        }

        .text-warning {
          color: #ffc107;
        }

        .text-warning-half {
          color: #ffc107;
          opacity: 0.7;
        }

        .text-muted {
          color: #e0e0e0;
        }
        .text-muted-dark {
          color: #6c757d !important;
          font-size: 0.9rem;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hero-section {
            padding: 60px 0;
            border-bottom-left-radius: 30px;
            border-bottom-right-radius: 30px;
          }
          .hero-section h1 {
            font-size: 2.5rem;
          }
          .hero-section p {
            font-size: 1rem;
          }
          .service-card-modern {
            min-height: auto;
            padding: 25px;
          }
          .service-card-modern h5 {
            font-size: 1.25rem;
          }
          .icon-wrapper-modern {
            width: 60px;
            height: 60px;
            padding: 12px;
          }
          .icon-wrapper-modern svg {
            font-size: 30px !important;
          }
          .btn-purple-outline {
            padding: 8px 20px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
};

export default Services;