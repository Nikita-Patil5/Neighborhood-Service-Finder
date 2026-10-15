import React, { useEffect, useState } from "react";
import {
  getMyServices,
  createService,
  updateService,
  deleteService,
  getMyBookings,
  updateBookingStatus,
} from "../../api/providerApi"; // Adjust path as needed
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Card,
  Row,
  Col,
  Alert,
  Spinner,
  Badge,
  ListGroup, // Added for better detail presentation
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaSignOutAlt,
  FaClipboardList,
  FaCalendarCheck,
  FaStar,
  FaEye, // Added for View Details button
  FaUser, // Icon for user details
  FaPhone, // Icon for phone
  FaMapMarkedAlt, // Icon for address
  FaTag, // Icon for price
  FaClock, // Icon for time
  FaCalendarAlt, // Icon for date
  FaInfoCircle, // Icon for status
  FaCheckDouble,
} from "react-icons/fa";
import { format } from "date-fns";
import "./ProviderDashboard.css"; // We'll create this CSS file
import ProviderInsights from "./ProviderInsights";

// StarRating component for consistent display
const StarRating = ({ rating }) => {
  return (
    <div>
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar key={i} color={i < rating ? "#ffc107" : "#e4e5e9"} />
      ))}
    </div>
  );
};

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false); // Renamed for clarity
  const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false); // New state for booking details modal
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null); // New state for selected booking
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [providerName, setProviderName] = useState("Provider");

  useEffect(() => {
    const storedProviderName = localStorage.getItem("userName");
    if (storedProviderName) {
      setProviderName(storedProviderName);
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([loadServices(), loadBookings()]);
      } catch (err) {
        setError("Failed to load dashboard data.");
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getMyServices();
      setServices(data || []);
    } catch (err) {
      setError("Failed to load services.");
      throw err;
    }
  };

  const loadBookings = async () => {
    try {
      const data = await getMyBookings();
      const sortedBookings = (data || []).sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.startTime}`);
        const dateTimeB = new Date(`${b.date}T${b.startTime}`);
        return dateTimeB - dateTimeA; // Sort by most recent booking first
      });
      setBookings(sortedBookings);
    } catch (err) {
      setError("Failed to load bookings.");
      throw err;
    }
  };

  const handleShowAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 5000);
  };

  const handleSaveService = async () => {
    if (!selectedService.name || !selectedService.description || !selectedService.price || !selectedService.category) {
      handleShowAlert("Please fill in all service fields.", "warning");
      return;
    }
    try {
      if (selectedService.id) {
        await updateService(selectedService.id, {
          name: selectedService.name,
          description: selectedService.description,
          price: parseFloat(selectedService.price),
          category: selectedService.category,
        });
        handleShowAlert("Service updated successfully!", "success");
      } else {
        await createService({ ...selectedService, price: parseFloat(selectedService.price) });
        handleShowAlert("Service created successfully!", "success");
      }
      setShowServiceModal(false); // Use renamed state
      loadServices();
    } catch (err) {
      handleShowAlert("Failed to save service: " + (err.response?.data?.message || err.message || "An error occurred."), "danger");
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      try {
        await deleteService(id);
        handleShowAlert("Service deleted successfully!", "success");
        loadServices();
      } catch (err) {
        handleShowAlert("Failed to delete service: " + (err.response?.data?.message || err.message || "An error occurred."), "danger");
      }
    }
  };

  const handleBookingStatusChange = async (id, status) => {
    if (window.confirm(`Are you sure you want to change this booking status to ${status}?`)) {
      try {
        await updateBookingStatus(id, status);
        handleShowAlert(`Booking status updated to ${status}!`, "success");
        loadBookings();
      } catch (err) {
        handleShowAlert("Failed to update booking status: " + (err.response?.data?.message || err.message || "An error occurred."), "danger");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId"); // Also clear userId if stored
    navigate("/"); // Redirect to home or login page
  };

  const handleViewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetailsModal(true);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "CONFIRMED": return "success";
      case "PENDING": return "warning";
      case "CANCELLED": return "danger";
       case "DONE": return "primary";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5 loading-spinner-container">
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
        <Alert variant="danger" className="shadow-sm">
          <h3>Oops! Something went wrong.</h3>
          <p>{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>Retry Loading Dashboard</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5 provider-dashboard">
      {/* Header */}
      <Card className="mb-4 dashboard-header">
        <Card.Body className="d-flex justify-content-between align-items-center bg-white rounded p-4">
          <h1 className="mb-0 text-primary">Welcome, <span className="fw-bold">{providerName}</span>!</h1>
          <Button variant="outline-danger" className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Logout
          </Button>
        </Card.Body>
      </Card>

      {/* Global Alert */}
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible className="mb-4 shadow-sm">
          {alert.message}
        </Alert>
      )}

      <Row className="g-4">
        {/* Services Section */}
        <Col lg={6}>
          <Card className="h-100 shadow-lg dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title mb-0">
                  <FaClipboardList className="me-2 text-primary" /> My Services
                </h2>
                <Button
                  variant="primary"
                  className="add-service-button"
                  onClick={() => {
                    setSelectedService({ name: "", description: "", price: "", category: "" });
                    setShowServiceModal(true);
                  }}
                >
                  <FaPlus className="me-2" /> Add Service
                </Button>
              </div>
              <div className="table-responsive">
                <Table bordered hover striped className="align-middle text-center dashboard-table">
                  <thead className="bg-light">
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.length > 0 ? services.map((s) => (
                      <tr key={s.id}>
                        <td className="text-start">{s.name}</td>
                        <td>${s.price?.toFixed(2)}</td>
                        <td><Badge bg="info" className="service-category-badge">{s.category}</Badge></td>
                        <td>
                          <Button size="sm" variant="outline-primary" className="me-2 action-button"
                            onClick={() => { setSelectedService(s); setShowServiceModal(true); }}
                            title="Edit Service"><FaEdit /></Button>
                          <Button size="sm" variant="outline-danger" className="action-button"
                            onClick={() => handleDeleteService(s.id)}
                            title="Delete Service"><FaTrash /></Button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted py-3">No services added yet. Click "Add Service" to get started!</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Bookings Section */}
        <Col lg={6}>
          <Card className="h-100 shadow-lg dashboard-card">
            <Card.Body>
              <h2 className="card-title mb-4">
                <FaCalendarCheck className="me-2 text-primary" /> My Bookings
              </h2>
              <div className="table-responsive">
                <Table bordered hover striped className="align-middle text-center dashboard-table">
                  <thead className="bg-light">
                    <tr>
                      <th>Service</th>
                      <th>User</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {bookings.length > 0 ? bookings.map((b) => (
                      <tr key={b.id}>
                        <td className="text-start">{b.serviceName}</td>
                        <td className="text-start">{b.userName}</td>
                        <td>
                          {b.date ? format(new Date(b.date), "MMM dd, yyyy") : 'N/A'} <br />
                          <small className="text-muted">{b.startTime} - {b.endTime}</small>
                        </td>
                        <td>
                          <Badge pill bg={getStatusVariant(b.status)} className="p-2 status-badge">
                            {b.status}
                          </Badge>
                        </td>
                        <td>
                          <Button size="sm" variant="outline-info" className="me-2 action-button"
                            onClick={() => handleViewBookingDetails(b)}
                            title="View Details"><FaEye /></Button>
                          {b.status === "PENDING" && (
                            <Button size="sm" variant="outline-success" className="me-2 action-button"
                              onClick={() => handleBookingStatusChange(b.id, "CONFIRMED")}
                              title="Confirm Booking"><FaCheckCircle /></Button>
                          )}
                          {b.status !== "CANCELLED" && (
                            <Button size="sm" variant="outline-danger" className="action-button"
                              onClick={() => handleBookingStatusChange(b.id, "CANCELLED")}
                              title="Cancel Booking"><FaTimesCircle /></Button>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-3">No bookings have been made for your services yet.</td>
                      </tr>
                    )} */}
                    {bookings.length > 0 ? bookings.map((b) => (
                      <tr key={b.id}>
                        <td className="text-start">{b.serviceName}</td>
                        <td className="text-start">{b.userName}</td>
                        <td>
                          {b.date ? format(new Date(b.date), "MMM dd, yyyy") : 'N/A'} <br />
                          <small className="text-muted">{b.startTime} - {b.endTime}</small>
                        </td>
                        <td>
                          <Badge pill bg={getStatusVariant(b.status)} className="p-2 status-badge">
                            {b.status}
                          </Badge>
                        </td>
                        <td>
                          <Button size="sm" variant="outline-info" className="me-2 action-button"
                            onClick={() => handleViewBookingDetails(b)}
                            title="View Details"><FaEye /></Button>
                          {b.status === "PENDING" && (
                            <Button size="sm" variant="outline-success" className="me-2 action-button"
                              onClick={() => handleBookingStatusChange(b.id, "CONFIRMED")}
                              title="Confirm Booking"><FaCheckCircle /></Button>
                          )}
                          {/* NEW: Mark as Done button */}
                          {b.status === "CONFIRMED" && (
                            <Button size="sm" variant="outline-primary" className="me-2 action-button" // Changed variant to primary for DONE
                              onClick={() => handleBookingStatusChange(b.id, "DONE")}
                              title="Mark as Done"><FaCheckDouble /></Button>
                          )}
                          {/* Cancel button should be available for PENDING and CONFIRMED */}
                          {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                            <Button size="sm" variant="outline-danger" className="action-button"
                              onClick={() => handleBookingStatusChange(b.id, "CANCELLED")}
                              title="Cancel Booking"><FaTimesCircle /></Button>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-3">No bookings have been made for your services yet.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ProviderInsights />

      {/* Service Modal (Add/Edit) */}
      <Modal show={showServiceModal} onHide={() => setShowServiceModal(false)} centered>
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>{selectedService?.id ? "Edit Service" : "Add New Service"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Haircut, Massage"
                value={selectedService?.name || ""}
                onChange={(e) => setSelectedService({ ...selectedService, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your service..."
                value={selectedService?.description || ""}
                onChange={(e) => setSelectedService({ ...selectedService, description: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="e.g., 50.00"
                value={selectedService?.price || ""}
                onChange={(e) => setSelectedService({ ...selectedService, price: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Beauty, Wellness, Home Repair"
                value={selectedService?.category || ""}
                onChange={(e) => setSelectedService({ ...selectedService, category: e.target.value })}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowServiceModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveService}>
            {selectedService?.id ? "Update Service" : "Add Service"}
          </Button>
        </Modal.Footer>
      </Modal>

       {/* Booking Details Modal */}
      <Modal show={showBookingDetailsModal} onHide={() => setShowBookingDetailsModal(false)} size="lg" centered>
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking ? (
            <Card className="p-4 shadow-sm border-0">
              <Card.Title className="text-primary mb-4 h4">
                <FaClipboardList className="me-2" /> {selectedBooking.serviceName}
                <Badge bg={getStatusVariant(selectedBooking.status)} className="ms-3 p-2 status-badge">
                  {selectedBooking.status}
                </Badge>
              </Card.Title>
              <Row className="g-4">
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex align-items-center">
                      <FaCalendarAlt className="me-3 text-muted" />
                      <div>
                        <strong>Date:</strong> {selectedBooking.date ? format(new Date(selectedBooking.date), "MMM dd, yyyy") : 'N/A'}
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center">
                      <FaClock className="me-3 text-muted" />
                      <div>
                        <strong>Time:</strong> {selectedBooking.startTime} - {selectedBooking.endTime}
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center">
                      <FaTag className="me-3 text-muted" />
                      <div>
                        <strong>Price:</strong> <span className="text-success fw-bold">${selectedBooking.price?.toFixed(2)}</span>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex align-items-center">
                      <FaUser className="me-3 text-muted" />
                      <div>
                        <strong>User Name:</strong> {selectedBooking.userName}
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center">
                      <FaPhone className="me-3 text-muted" />
                      <div>
                        <strong>User Phone:</strong> {selectedBooking.userPhoneNumber || "N/A"}
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center">
                      <FaMapMarkedAlt className="me-3 text-muted" />
                      <div>
                        <strong>User Address:</strong> {selectedBooking.userAddress || "N/A"}
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
              <hr className="my-4" />
              <div className="review-section">
                <h5 className="mb-3 text-primary"><FaStar className="me-2" /> Customer Review</h5>
                {selectedBooking.reviewComment ? (
                  <>
                    <div className="mb-2">
                      <StarRating rating={selectedBooking.rating} />
                    </div>
                    {/* ADDED: Display User Name for the Review */}
                    <p className="text-muted mb-1">
                      Reviewed by: <strong>{selectedBooking.userName}</strong>
                    </p>
                    <p className="blockquote-footer mb-0">
                      "{selectedBooking.reviewComment}"
                    </p>
                  </>
                ) : (
                  <p className="text-muted">No review available for this booking yet.</p>
                )}
              </div>
            </Card>
          ) : (
            <p className="text-center text-muted">No booking selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProviderDashboard;