import React, { useEffect, useState } from "react";
import {
  getAllUsers, deleteUser,
  getAllProviders, deleteProvider,
  getAllServices, deleteService,
  getAllBookings, updateBookingStatusAdmin, deleteBooking,
  getAllReviews, deleteReview
} from "../../api/adminApi";
import { Container, Row, Col, Card, Button, Table, Modal, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaUsers, FaHandsHelping, FaConciergeBell, FaCalendarCheck,
  FaTrashAlt, FaCheckCircle, FaTimesCircle, FaEye, FaSignOutAlt, FaStar
} from 'react-icons/fa';
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await getAllUsers());
      setProviders(await getAllProviders());
      setServices(await getAllServices());
      setBookings(await getAllBookings());
      setReviews(await getAllReviews());
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "PENDING": return "warning";
      case "CONFIRMED": return "success";
      case "CANCELLED": return "danger";
      case "COMPLETED": return "info";
      default: return "secondary";
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try { await deleteUser(id); loadData(); } 
      catch (err) { console.error(err); alert("Failed to delete user"); }
    }
  };

  const handleDeleteProvider = async (id) => {
    if (window.confirm("Are you sure you want to delete this provider?")) {
      try { await deleteProvider(id); loadData(); } 
      catch (err) { console.error(err); alert("Failed to delete provider"); }
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try { await deleteService(id); loadData(); } 
      catch (err) { console.error(err); alert("Failed to delete service"); }
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try { await deleteBooking(id); loadData(); } 
      catch (err) { console.error(err); alert("Failed to delete booking"); }
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try { await deleteReview(id); loadData(); } 
      catch (err) { console.error(err); alert("Failed to delete review"); }
    }
  };

  const handleBookingAction = async (id, status) => {
    try { await updateBookingStatusAdmin(id, status); loadData(); setSelectedBooking(null); } 
    catch (err) { console.error(err); alert(`Failed to update booking status to ${status}`); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
      <p className="ms-3">Loading dashboard data...</p>
    </Container>
  );

  if (error) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="alert alert-danger" role="alert">
        {error} <Button variant="link" onClick={loadData}>Retry</Button>
      </div>
    </Container>
  );

  return (
    <div className="admin-dashboard-container">
      <Container fluid className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <Button variant="outline-danger" onClick={handleLogout}><FaSignOutAlt className="me-2" /> Logout</Button>
        </div>

        {/* Stats Cards */}
        <Row className="mb-5 stats-cards-row">
          <Col md={3} className="mb-4">
            <Card className="shadow-sm border-0 stat-card user-stat-card">
              <Card.Body className="d-flex align-items-center">
                <FaUsers className="stat-icon me-3 user-icon" />
                <div><h6 className="text-muted mb-0">Total Users</h6><h2 className="mb-0">{users.length}</h2></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="shadow-sm border-0 stat-card provider-stat-card">
              <Card.Body className="d-flex align-items-center">
                <FaHandsHelping className="stat-icon me-3 provider-icon" />
                <div><h6 className="text-muted mb-0">Total Providers</h6><h2 className="mb-0">{providers.length}</h2></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="shadow-sm border-0 stat-card service-stat-card">
              <Card.Body className="d-flex align-items-center">
                <FaConciergeBell className="stat-icon me-3 service-icon" />
                <div><h6 className="text-muted mb-0">Total Services</h6><h2 className="mb-0">{services.length}</h2></div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="shadow-sm border-0 stat-card booking-stat-card">
              <Card.Body className="d-flex align-items-center">
                <FaCalendarCheck className="stat-icon me-3 booking-icon" />
                <div><h6 className="text-muted mb-0">Total Bookings</h6><h2 className="mb-0">{bookings.length}</h2></div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Users Table */}
        <Card className="shadow-sm mb-5 data-table-card">
          <Card.Header className="card-header-custom"><h4 className="mb-0">Users Management</h4></Card.Header>
          <Card.Body>
            <Table responsive hover className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length===0 ? <tr><td colSpan="6" className="text-center text-muted">No users found.</td></tr> :
                  users.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phoneNumber}</td>
                      <td>{u.address}</td>
                      <td className="text-center">
                        <Button size="sm" variant="outline-danger" onClick={()=>handleDeleteUser(u.id)} title="Delete User"><FaTrashAlt /></Button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Providers Table */}
        <Card className="shadow-sm mb-5 data-table-card">
          <Card.Header className="card-header-custom"><h4 className="mb-0">Providers Management</h4></Card.Header>
          <Card.Body>
            <Table responsive hover className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {providers.length===0 ? <tr><td colSpan="6" className="text-center text-muted">No providers found.</td></tr> :
                  providers.map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.email}</td>
                      <td>{p.phoneNumber}</td>
                      <td>{p.address}</td>
                      <td className="text-center">
                        <Button size="sm" variant="outline-danger" onClick={()=>handleDeleteProvider(p.id)} title="Delete Provider"><FaTrashAlt /></Button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </Card.Body>
        </Card>

            {/* Services Table */}
          <Card className="shadow-sm mb-5 data-table-card">
            <Card.Header className="card-header-custom"><h4 className="mb-0">Services Management</h4></Card.Header>
            <Card.Body>
              <Table responsive hover className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Provider Name</th>
                    <th>Provider Phone</th>
                    <th>Provider Address</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">No services found.</td>
                    </tr>
                  ) : (
                    services.map(s => (
                      <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.name}</td>
                        <td>${s.price?.toFixed(2)}</td>
                        <td>{s.providerName}</td>
                        <td>{s.providerPhoneNumber}</td>
                        <td>{s.providerAddress}</td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="outline-danger"
                            className="action-button"
                            onClick={() => handleDeleteService(s.id)}
                            title="Delete Service"
                          ><FaTrashAlt /></Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>


        {/* Bookings Table */}
        <Card className="shadow-sm mb-5 data-table-card">
          <Card.Header className="card-header-custom"><h4 className="mb-0">Bookings Management</h4></Card.Header>
          <Card.Body>
            <Table responsive hover className="data-table">
              <thead><tr><th>ID</th><th>User</th><th>Provider</th><th>Service</th><th>Date</th><th>Status</th><th className="text-center">Actions</th></tr></thead>
              <tbody>
                {bookings.length===0 ? <tr><td colSpan="7" className="text-center text-muted">No bookings found.</td></tr> :
                  bookings.map(b => (<tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.userName}</td>
                    <td>{b.providerName}</td>
                    <td>{b.serviceName}</td>
                    <td>{b.date ? new Date(b.date).toLocaleDateString():'N/A'}</td>
                    <td><Badge bg={getStatusBadgeVariant(b.status)} className="status-badge">{b.status}</Badge></td>
                    <td className="text-center booking-actions">
                      <Button size="sm" variant="outline-info" className="action-button me-1" onClick={()=>setSelectedBooking(b)} title="View Details"><FaEye /></Button>
                      {b.status==="PENDING" && <>
                        <Button size="sm" variant="outline-success" className="action-button me-1" onClick={()=>handleBookingAction(b.id,"CONFIRMED")} title="Approve Booking"><FaCheckCircle /></Button>
                        <Button size="sm" variant="outline-warning" className="action-button" onClick={()=>handleBookingAction(b.id,"CANCELLED")} title="Cancel Booking"><FaTimesCircle /></Button>
                      </>}
                    </td>
                  </tr>))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Reviews Table */}
        <Card className="shadow-sm mb-5 data-table-card">
          <Card.Header className="card-header-custom"><h4 className="mb-0">Reviews Management</h4></Card.Header>
          <Card.Body>
            <Table responsive hover className="data-table">
              <thead><tr><th>ID</th><th>User</th><th>Provider</th><th>Rating</th><th>Comment</th><th>Date</th><th className="text-center">Action</th></tr></thead>
              <tbody>
                {reviews.length===0 ? <tr><td colSpan="7" className="text-center text-muted">No reviews found.</td></tr> :
                  reviews.map(r => (<tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.userName}</td>
                    <td>{r.providerName}</td>
                    <td>{r.rating} <FaStar className="star-icon" /></td>
                    <td>{r.comment}</td>
                    <td>{r.createdAt}</td>
                    <td className="text-center"><Button size="sm" variant="outline-danger" className="action-button" onClick={()=>handleDeleteReview(r.id)} title="Delete Review"><FaTrashAlt /></Button></td>
                  </tr>))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Booking Modal */}
        <Modal show={!!selectedBooking} onHide={()=>setSelectedBooking(null)} centered>
          <Modal.Header closeButton className="modal-header-custom">
            <Modal.Title>Booking Details #{selectedBooking?.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-custom">
            <p><strong>User:</strong> {selectedBooking?.userName}</p>
            <p><strong>Provider:</strong> {selectedBooking?.providerName}</p>
            <p><strong>Service:</strong> {selectedBooking?.serviceName}</p>
            <p><strong>Date:</strong> {selectedBooking?.date ? new Date(selectedBooking.date).toLocaleDateString():'N/A'}</p>
            <p><strong>Status:</strong> <Badge bg={getStatusBadgeVariant(selectedBooking?.status)} className="ms-2">{selectedBooking?.status}</Badge></p>
          </Modal.Body>
          <Modal.Footer>
            {selectedBooking?.status==="PENDING" && <>
              <Button variant="success" onClick={()=>handleBookingAction(selectedBooking.id,"CONFIRMED")}><FaCheckCircle className="me-2"/>Approve</Button>
              <Button variant="warning" onClick={()=>handleBookingAction(selectedBooking.id,"CANCELLED")}><FaTimesCircle className="me-2"/>Cancel</Button>
            </>}
            <Button variant="secondary" onClick={()=>setSelectedBooking(null)}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminDashboard;


