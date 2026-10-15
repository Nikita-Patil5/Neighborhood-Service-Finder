import React, { useEffect, useState, useCallback } from "react";
import {
  getAllServices,
  getMyBookings,
  createBooking,
  cancelBooking,
  getUserReviews,
  addReview,
  updateReview,
  deleteReview,
} from "../../api/userApi"; // Ensure your API has these
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Badge,
  ListGroup,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaTools,
  FaCalendarCheck,
  FaPlusCircle,
  FaSignOutAlt,
  FaInfoCircle,
  FaStar,
  FaRegStar,
  FaCommentDots,
  FaEdit,
  FaTrash,
  FaEye, 
  FaUser, 
  FaPhone, 
  FaMapMarkedAlt, 
} from "react-icons/fa";
import { format } from "date-fns";
import ReviewInsights from "../../components/ReviewInsights";

// Helper component for Star Rating display/input
const StarRating = ({ rating, setRating, editable = false }) => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => editable && setRating(star)}
          style={{ cursor: editable ? "pointer" : "default", color: "#ffc107" }}
        >
          {star <= rating ? <FaStar /> : <FaRegStar />}
        </span>
      ))}
    </div>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);

  const [showReviewActionModal, setShowReviewActionModal] = useState(false);
  const [reviewModalView, setReviewModalView] = useState("manage"); // 'add', 'edit', 'manage'

  const [newBooking, setNewBooking] = useState({
    serviceId: "",
    date: "",
    startTime: "",
    endTime: "",
  });
  const [selectedBooking, setSelectedBooking] = useState(null); // For booking details modal
  const [userReviews, setUserReviews] = useState([]); // This stores reviews fetched via getUserReviews

  // For the review form itself (when adding/editing)
  const [reviewForm, setReviewForm] = useState({
    id: null, // ID of the review if editing
    bookingId: "", // Booking associated with this review
    serviceId: "",
    serviceName: "",
    rating: 0,
    comment: "",
  });

  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const handleShowAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 5000);
  };

  const loadServices = useCallback(async () => {
    try {
      const data = await getAllServices();
      setServices(data || []);
    } catch (err) {
      console.error("Error loading services:", err);
      setError("Failed to load available services.");
      throw err; // Re-throw to be caught by parent useEffect for overall loading state
    }
  }, []);

  const loadBookings = useCallback(async () => {
    try {
      const data = await getMyBookings();
      // Sort bookings by most recent first
      const sortedBookings = (data || []).sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.startTime}`);
        const dateTimeB = new Date(`${b.date}T${b.startTime}`);
        return dateTimeB - dateTimeA;
      });
      setBookings(sortedBookings);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError("Failed to load your bookings.");
      throw err; // Re-throw to be caught by parent useEffect for overall loading state
    }
  }, []);

  // Wrap loadUserReviews in useCallback and define its dependencies
  const loadUserReviews = useCallback(async () => {
    try {
      const data = await getUserReviews();
      // Map reviews to include serviceName from `services` state for display
      const reviewsWithServiceNames = data.map((review) => {
        const service = services.find((s) => s.id === review.serviceId);
        return {
          ...review,
          serviceName: service?.name || "Unknown Service",
        };
      });
      setUserReviews(reviewsWithServiceNames || []);
    } catch (err) {
      console.error("Error loading user reviews:", err);
      setError("Failed to load your reviews.");
      setUserReviews([]);
    }
  }, [services]); // Dependency on services to ensure service names can be looked up


  // Main data fetching effect
  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) setUserName(storedUserName);

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([loadServices(), loadBookings()]);
      } catch (err) {
        // Specific errors are handled in loadServices/loadBookings
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [loadServices, loadBookings]); // Dependencies are the memoized callbacks

  // Effect to load reviews AFTER services are loaded
  useEffect(() => {
      if (!loading && services.length > 0) { // Only attempt to load reviews once services are likely loaded
          loadUserReviews();
      }
  }, [loading, services, loadUserReviews]); // Add loadUserReviews as a dependency too


  const handleCreateBooking = async () => {
    try {
      if (
        !newBooking.serviceId ||
        !newBooking.date ||
        !newBooking.startTime ||
        !newBooking.endTime
      ) {
        handleShowAlert("Please fill all booking fields!", "warning");
        return;
      }
      await createBooking(newBooking);
      handleShowAlert("Booking created successfully!", "success");
      setShowBookingModal(false);
      setNewBooking({ serviceId: "", date: "", startTime: "", endTime: "" });
      loadBookings();
    } catch (err) {
      handleShowAlert(
        "Failed to create booking: " +
          (err.response?.data?.message || err.message),
        "danger"
      );
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelBooking(id);
        handleShowAlert("Booking cancelled successfully!", "success");
        loadBookings();
      } catch (err) {
        handleShowAlert(
          "Cancel failed: " + (err.response?.data?.message || err.message),
          "danger"
        );
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetailsModal(true);
  };

  // --- Review Management Functions ---
  const openAddReviewModal = (booking = null) => {
    if (booking) {
        const service = services.find(s => s.id === booking.serviceId);
        setReviewForm({
            id: null, // Always null for new review
            bookingId: booking.id,
            serviceId: booking.serviceId,
            serviceName: service?.name || "Unknown Service",
            rating: 0,
            comment: "",
        });
    } else {
        // For general "Add New Review" button
        setReviewForm({
            id: null,
            bookingId: "", // User will select this from dropdown
            serviceId: "", // User will select this from dropdown
            serviceName: "",
            rating: 0,
            comment: "",
        });
    }
    setReviewModalView("add");
    setShowReviewActionModal(true);
  };

  const openManageReviewsModal = () => {
    loadUserReviews(); // Refresh reviews list
    setReviewForm({ // Clear form when navigating to manage view
      id: null, bookingId: "", serviceId: "", serviceName: "", rating: 0, comment: "",
    });
    setReviewModalView("manage");
    setShowReviewActionModal(true);
  };

  const openEditReviewModal = (review) => {
    const service = services.find(s => s.id === review.serviceId);
    setReviewForm({
      id: review.id,
      bookingId: review.bookingId,
      serviceId: review.serviceId,
      rating: review.rating,
      comment: review.comment,
      serviceName: service?.name || "Unknown Service", // Ensure serviceName is correct
    });
    setReviewModalView("edit");
    setShowReviewActionModal(true);
  };

  const handleAddOrUpdateReview = async () => {
  if (!reviewForm.rating || !reviewForm.comment.trim()) {
    handleShowAlert("Please provide a rating (1-5) and a comment.", "warning");
    return;
  }

  // --- Crucial Adjustment Here ---
  // For adding a new review, we need bookingId and serviceId.
  // For updating an existing review, the backend only needs rating and comment,
  // as the review ID identifies the booking and service it's linked to.
  let dataToSend = {
    rating: reviewForm.rating,
    comment: reviewForm.comment,
  };

  if (reviewForm.id) {
    // This is an UPDATE. Backend expects only rating and comment.
    // The path variable `id` handles identifying the review.
    // No need to send bookingId or serviceId in the body for update.
    try {
      await updateReview(reviewForm.id, dataToSend); // Send only rating and comment
      handleShowAlert("Review updated successfully!", "success");
    } catch (err) {
      handleShowAlert(
        "Failed to update review: " + (err.response?.data?.message || err.message),
        "danger"
      );
      return; // Stop execution on error
    }
  } else {
    // This is an ADD. Backend expects bookingId, serviceId, rating, and comment.
    if (!reviewForm.serviceId || !reviewForm.bookingId) {
      handleShowAlert("A service and booking must be associated with the review.", "warning");
      return;
    }
    dataToSend = {
      ...dataToSend, // Include rating and comment
      bookingId: reviewForm.bookingId,
      serviceId: reviewForm.serviceId,
    };
    try {
      await addReview(dataToSend);
      handleShowAlert("Review added successfully!", "success");
    } catch (err) {
      handleShowAlert(
        "Failed to add review: " + (err.response?.data?.message || err.message),
        "danger"
      );
      return; // Stop execution on error
    }
  }

  // Common success actions for both add and update
  await loadUserReviews();
  await loadBookings(); // This is important to refresh review status indicators on bookings
  setShowReviewActionModal(false);
  setReviewForm({ id: null, bookingId: "", serviceId: "", serviceName: "", rating: 0, comment: "" });
};

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review? This cannot be undone.")) {
      try {
        await deleteReview(reviewId);
        handleShowAlert("Review deleted successfully!", "success");
        loadUserReviews(); // Refresh the list
        loadBookings(); // Refresh bookings to update review status indicators
        if (showReviewActionModal) {
          setReviewModalView("manage"); // Go back to managing reviews
          setReviewForm({ // Reset form
            id: null, bookingId: "", serviceId: "", serviceName: "", rating: 0, comment: "",
          });
        }
      } catch (err) {
        handleShowAlert(
          "Failed to delete review: " + (err.response?.data?.message || err.message),
          "danger"
        );
      }
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "danger";
      case "DONE":
        return "primary";
      default:
        return "secondary";
    }
  };

  // Filter bookings for the review modal (only DONE and not yet reviewed)
  const getReviewableBookings = useCallback(() => {
    return bookings.filter(b => 
        b.status === "DONE" && 
        !b.rating // Assuming `b.rating` exists on booking if reviewed
    );
  }, [bookings]);

  // Filter bookings for selecting a booking for a specific service in "Add Review" modal
  const getReviewableBookingsForService = useCallback((serviceId) => {
      return bookings.filter(b => 
          b.serviceId === serviceId && 
          b.status === "DONE" && 
          !b.rating // Assuming `b.rating` exists on booking if reviewed
      );
  }, [bookings]);


  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3 text-muted">Loading your dashboard data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center my-5">
        <Alert variant="danger">
          <h3>Oops! Something went wrong.</h3>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>Retry Loading Dashboard</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>
            Welcome, <span className="text-primary">{userName}!</span>
          </h1>
          <p className="text-muted">
            Manage your services, bookings, and reviews.
          </p>
        </Col>
        <Col xs="auto">
          <Button variant="outline-danger" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Logout
          </Button>
        </Col>
      </Row>

      {/* Global Alert */}
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible className="mb-4 shadow-sm">
          {alert.message}
        </Alert>
      )}

      {/* Services Section */}
      <Card className="mb-5 p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>
            <FaTools className="me-2 text-primary" /> Available Services
          </h2>
          <Button variant="primary" onClick={() => setShowBookingModal(true)}>
            <FaPlusCircle className="me-2" /> New Booking
          </Button>
        </div>
        <Row className="g-4">
          {services.length === 0 && (
            <p className="text-center text-muted">
              No services available at the moment.
            </p>
          )}
          {services.map((s) => (
            <Col lg={4} md={6} key={s.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-primary">{s.name}</Card.Title>
                  <Card.Text className="text-muted">{s.description}</Card.Text>
                  <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item>
                      <b>Price:</b> ${s.price?.toFixed(2)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <b>Provider:</b> {s.providerName}
                    </ListGroup.Item>
                    {/* Assuming FaUser, FaPhone, FaMapMarkedAlt are imported if you want these */}
                    <ListGroup.Item>
                       <FaPhone className="me-2 text-info" /><b>Phone:</b> {s.providerPhoneNumber || "N/A"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                       <FaMapMarkedAlt className="me-2 text-secondary" /><b>Address:</b> {s.providerAddress || "N/A"}
                    </ListGroup.Item>
                  </ListGroup>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setNewBooking({ ...newBooking, serviceId: s.id });
                      setShowBookingModal(true);
                    }}
                  >
                    Book Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Bookings Section */}
      <Card className="p-4 mb-5 shadow-sm">
        <h2>
          <FaCalendarCheck className="me-2 text-primary" /> My Bookings
        </h2>
        {bookings.length === 0 ? (
          <p className="text-center text-muted">
            You haven't made any bookings yet.
          </p>
        ) : (
          <Table responsive striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Service</th>
                <th>Provider</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.serviceName}</td>
                  <td>{b.providerName}</td>
                  <td>{b.date ? format(new Date(b.date), "MMM dd, yyyy") : 'N/A'}</td>
                  <td>
                    {b.startTime} - {b.endTime}
                  </td>
                  <td>
                    <Badge pill bg={getStatusVariant(b.status)}>
                      {b.status}
                    </Badge>
                  </td>
                  <td>${b.price?.toFixed(2)}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      className="me-2"
                      onClick={() => handleViewBooking(b)}
                      title="View Booking Details"
                    >
                      <FaInfoCircle /> View
                    </Button>
                    {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleCancelBooking(b.id)}
                        title="Cancel Booking"
                      >
                        Cancel
                      </Button>
                    )}
                    {/* NEW: Review/View Review Buttons - relies on booking having .rating and .reviewId */}
                    {b.status === "DONE" && !b.rating && ( // If status is DONE and no rating (meaning no review)
                         <Button
                            size="sm"
                            variant="success"
                            className="ms-2"
                            onClick={() => openAddReviewModal(b)} // Pass the booking object
                            title="Leave a Review"
                         >
                            <FaCommentDots /> Review
                         </Button>
                    )}
                    {b.status === "DONE" && b.rating > 0 && ( // If status is DONE and a rating exists (meaning reviewed)
                         <Button
                            size="sm"
                            variant="primary"
                            className="ms-2"
                            onClick={() => openEditReviewModal({ // Pass review data for viewing/editing
                                id: b.reviewId, // <-- CRITICAL: Assumes booking object has reviewId
                                bookingId: b.id,
                                serviceId: b.serviceId,
                                serviceName: b.serviceName,
                                rating: b.rating, // <-- CRITICAL: Assumes booking object has rating
                                comment: b.comment, // <-- CRITICAL: Assumes booking object has comment
                            })}
                            title="View Your Review"
                         >
                            <FaEye /> View Review
                         </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* My Reviews Section (simplified for summary, management in modal) */}
      <Card className="p-4 mb-5 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>
            <FaCommentDots className="me-2 text-primary" /> My Reviews
          </h2>
          <div>
            <Button variant="outline-primary" onClick={openManageReviewsModal}>
              <FaEdit className="me-2" /> Manage My Reviews
            </Button>
          </div>
        </div>
        {userReviews.length === 0 ? (
          <p className="text-center text-muted">
            You haven't written any reviews yet.
          </p>
        ) : (
          <ListGroup variant="flush">
            {userReviews.slice(0, 3).map((r) => (
              <ListGroup.Item
                key={r.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{r.serviceName}</strong> -{" "}
                  <StarRating rating={r.rating} />
                  <p className="mb-0 text-muted">{r.comment}</p>
                  <ReviewInsights review={r} flagText="Under review, hidden from public" />
                </div>
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => openEditReviewModal(r)}
                    title="Edit Review"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDeleteReview(r.id)}
                    title="Delete Review"
                  >
                    <FaTrash />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
            {userReviews.length > 3 && (
              <ListGroup.Item className="text-center">
                <Button variant="link" onClick={openManageReviewsModal}>
                  View All Reviews
                </Button>
              </ListGroup.Item>
            )}
          </ListGroup>
        )}
      </Card>

      {/* Booking Modal (for creating new bookings) */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book New Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Service</Form.Label>
              <Form.Select
                value={newBooking.serviceId}
                onChange={(e) => setNewBooking({ ...newBooking, serviceId: e.target.value })}
              >
                <option value="">Select Service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - ${s.price?.toFixed(2)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newBooking.date}
                onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={newBooking.startTime}
                onChange={(e) => setNewBooking({ ...newBooking, startTime: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={newBooking.endTime}
                onChange={(e) => setNewBooking({ ...newBooking, endTime: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateBooking}>
            Book Now
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Booking Details Modal (Only displays booking info) */}
      <Modal show={showBookingDetailsModal} onHide={() => setShowBookingDetailsModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <Card className="p-3 shadow-sm">
              <Card.Title className="text-primary mb-3">{selectedBooking.serviceName}</Card.Title>
              <Row>
                <Col md={6}>
                  <p>
                    <b>Provider:</b> {selectedBooking.providerName}
                  </p>
                  <p>
                    <b>Phone:</b> {selectedBooking.providerPhoneNumber || "N/A"}
                  </p>
                  <p>
                    <b>Address:</b> {selectedBooking.providerAddress || "N/A"}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <b>Date:</b> {selectedBooking.date ? format(new Date(selectedBooking.date), "MMM dd, yyyy") : 'N/A'}
                  </p>
                  <p>
                    <b>Time:</b> {selectedBooking.startTime} - {selectedBooking.endTime}
                  </p>
                  <p>
                    <b>Price:</b> <span className="text-success fw-bold">${selectedBooking.price?.toFixed(2)}</span>
                  </p>
                  <Badge pill bg={getStatusVariant(selectedBooking.status)} className="fs-6">
                    {selectedBooking.status}
                  </Badge>
                </Col>
              </Row>
              {/* If the booking is DONE and has a review, display it here too */}
              {selectedBooking.status === "DONE" && selectedBooking.rating > 0 && (
                <>
                  <hr className="my-3" />
                  <h5><FaCommentDots className="me-2 text-primary" /> Your Review:</h5>
                  <div className="mb-2">
                      <StarRating rating={selectedBooking.rating} />
                  </div>
                  <p className="blockquote-footer mb-0">
                      "{selectedBooking.comment}"
                  </p>
                </>
              )}
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* User Reviews Action Modal (for Add/Edit/Manage Reviews) */}
      <Modal show={showReviewActionModal} onHide={() => setShowReviewActionModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {reviewModalView === "add" && "Add New Review"}
            {reviewModalView === "edit" && "Edit Your Review"}
            {reviewModalView === "manage" && "Manage Your Reviews"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add/Edit Review Form */}
          {(reviewModalView === "add" || reviewModalView === "edit") && (
            <Card className="p-3 mb-4 shadow-sm">
              <h5 className="mb-3">
                {reviewForm.id ? "Edit Review" : "New Review"}
              </h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Service</Form.Label>
                  {/* Display service name read-only if already selected/pre-filled */}
                  {reviewForm.serviceId ? (
                    <Form.Control
                      type="text"
                      value={reviewForm.serviceName}
                      readOnly
                    />
                  ) : (
                    // Otherwise, allow selection from available services
                    <Form.Select
                        value={reviewForm.serviceId}
                        onChange={(e) => {
                            const selectedServiceId = parseInt(e.target.value);
                            const selectedService = services.find(s => s.id === selectedServiceId);
                            setReviewForm({
                                ...reviewForm,
                                serviceId: selectedServiceId,
                                serviceName: selectedService?.name || "",
                                bookingId: "", // Reset booking selection when service changes
                            });
                        }}
                        required
                    >
                        <option value="">Select a Service</option>
                        {services.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </Form.Select>
                  )}
                </Form.Group>

                {/* Booking Selection for Adding Review -
                    Only for 'add' view, and if a service is selected,
                    and if a booking is NOT already selected (i.e., not from a specific booking's "Review" button) */}
                {reviewModalView === "add" && reviewForm.serviceId && !reviewForm.bookingId && (
                    <Form.Group className="mb-3">
                        <Form.Label>Booking</Form.Label>
                        <Form.Select
                            value={reviewForm.bookingId}
                            onChange={(e) => setReviewForm({ ...reviewForm, bookingId: parseInt(e.target.value) })}
                            required
                        >
                            <option value="">Select Booking to Review</option>
                            {getReviewableBookingsForService(reviewForm.serviceId) // Use the filtered list
                                .map(b => (
                                <option key={b.id} value={b.id}>
                                    {b.date ? format(new Date(b.date), "MMM dd, yyyy") : 'N/A'} ({b.startTime} - {b.endTime}) - Provider: {b.providerName}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                            Only completed services that you haven't reviewed yet are shown.
                        </Form.Text>
                    </Form.Group>
                )}
                {/* Display booking info if it's already selected (e.g., from table or editing) */}
                {(reviewModalView === "edit" || (reviewModalView === "add" && reviewForm.bookingId)) && (
                    <Form.Group className="mb-3">
                        <Form.Label>Booking Details</Form.Label>
                        <Form.Control
                            type="text"
                            value={
                                reviewForm.bookingId
                                    ? `Booking ID: ${reviewForm.bookingId}, Date: ${bookings.find(b => b.id === reviewForm.bookingId)?.date || 'N/A'}`
                                    : 'N/A'
                            }
                            readOnly
                        />
                    </Form.Group>
                )}


                <Form.Group className="mb-3">
                  <Form.Label className="d-block">Rating:</Form.Label>
                  <StarRating
                    rating={reviewForm.rating}
                    setRating={(r) => setReviewForm({ ...reviewForm, rating: r })}
                    editable
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Comment:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Share your experience..."
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
                  />
                </Form.Group>
                <Button
                  variant="success"
                  onClick={handleAddOrUpdateReview}
                  className="w-100"
                >
                  {reviewForm.id ? "Update Review" : "Submit Review"}
                </Button>
              </Form>
            </Card>
          )}

          {/* All Your Reviews List */}
          {reviewModalView === "manage" && (
            <Card className="p-3 shadow-sm">
              <h5 className="mb-3">Your Reviews</h5>
              {userReviews.length === 0 ? (
                <p className="text-muted text-center">
                  You haven't written any reviews yet.
                </p>
              ) : (
                <ListGroup variant="flush">
                  {userReviews.map((r) => (
                    <ListGroup.Item
                      key={r.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{r.serviceName}</strong> -{" "}
                        <StarRating rating={r.rating} />
                        <p className="mb-0 text-muted">{r.comment}</p>
                        <ReviewInsights review={r} flagText="Under review, hidden from public" />
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => openEditReviewModal(r)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDeleteReview(r.id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          {/* Conditional footer buttons for navigation within the modal */}
          {reviewModalView === "edit" && (
            <Button
              variant="outline-secondary"
              onClick={() => setReviewModalView("manage")}
            >
              Back to All Reviews
            </Button>
          )}
          {reviewModalView === "manage" && (
            <Button variant="outline-primary" onClick={() => openAddReviewModal()}>
              Add New Review
            </Button>
          )}
          {/* CRITICAL FIX: Changed setShowUserReviewsModal to setShowReviewActionModal */}
          <Button variant="secondary" onClick={() => setShowReviewActionModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserDashboard;





