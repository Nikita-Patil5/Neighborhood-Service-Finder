// import React, { useEffect, useState } from "react";
// import {
//   getAllUsers, deleteUser,
//   getAllProviders, deleteProvider,
//   getAllServices, deleteService,
//   getAllBookings, updateBookingStatusAdmin, deleteBooking,
//   getAllReviews, deleteReview
// } from "../../api/adminApi";
// import { Container, Row, Col, Card, Button, Table, Modal, Badge } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import {
//   FaUsers, FaHandsHelping, FaConciergeBell, FaCalendarCheck,
//   FaTrashAlt, FaCheckCircle, FaTimesCircle, FaEye, FaSignOutAlt, FaStar
// } from 'react-icons/fa';
// import "./AdminDashboard.css";
// import ReviewInsights from "../../components/ReviewInsights";
// import { approveReview } from "../../api/aiApi";
// import AdminAnalytics from "./AdminAnalytics";

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [providers, setProviders] = useState([]);
//   const [services, setServices] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       setUsers(await getAllUsers());
//       setProviders(await getAllProviders());
//       setServices(await getAllServices());
//       setBookings(await getAllBookings());
//       setReviews(await getAllReviews());
//     } catch (err) {
//       console.error("Failed to load dashboard data:", err);
//       setError("Failed to load data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadgeVariant = (status) => {
//     switch (status) {
//       case "PENDING": return "warning";
//       case "CONFIRMED": return "success";
//       case "CANCELLED": return "danger";
//       case "DONE": return "info";
//       default: return "secondary";
//     }
//   };

//   const handleDeleteUser = async (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try { await deleteUser(id); loadData(); } 
//       catch (err) { console.error(err); alert("Failed to delete user"); }
//     }
//   };

//   const handleDeleteProvider = async (id) => {
//     if (window.confirm("Are you sure you want to delete this provider?")) {
//       try { await deleteProvider(id); loadData(); } 
//       catch (err) { console.error(err); alert("Failed to delete provider"); }
//     }
//   };

//   const handleDeleteService = async (id) => {
//     if (window.confirm("Are you sure you want to delete this service?")) {
//       try { await deleteService(id); loadData(); } 
//       catch (err) { console.error(err); alert("Failed to delete service"); }
//     }
//   };

//   const handleDeleteBooking = async (id) => {
//     if (window.confirm("Are you sure you want to delete this booking?")) {
//       try { await deleteBooking(id); loadData(); } 
//       catch (err) { console.error(err); alert("Failed to delete booking"); }
//     }
//   };

//   const handleDeleteReview = async (id) => {
//     if (window.confirm("Are you sure you want to delete this review?")) {
//       try { await deleteReview(id); loadData(); } 
//       catch (err) { console.error(err); alert("Failed to delete review"); }
//     }
//   };

//   const handleApproveReview = async (id) => {
//   try { await approveReview(id); loadData(); }
//   catch (err) { console.error(err); alert("Failed to approve review"); }
// };

// const flaggedCount = reviews.filter((r) => r.flagged).length;
// const visibleReviews = showFlaggedOnly ? reviews.filter((r) => r.flagged) : reviews;

//   const handleBookingAction = async (id, status) => {
//     try { await updateBookingStatusAdmin(id, status); loadData(); setSelectedBooking(null); } 
//     catch (err) { console.error(err); alert(`Failed to update booking status to ${status}`); }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   if (loading) return (
//     <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
//       <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
//       <p className="ms-3">Loading dashboard data...</p>
//     </Container>
//   );

//   if (error) return (
//     <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
//       <div className="alert alert-danger" role="alert">
//         {error} <Button variant="link" onClick={loadData}>Retry</Button>
//       </div>
//     </Container>
//   );

//   return (
//     <div className="admin-dashboard-container">
//       <Container fluid className="py-4">
//         <div className="d-flex justify-content-between align-items-center mb-4 dashboard-header">
//           <h1 className="dashboard-title">Admin Dashboard</h1>
//           <Button variant="outline-danger" onClick={handleLogout}><FaSignOutAlt className="me-2" /> Logout</Button>
//         </div>

//         {/* Stats Cards */}
//         <Row className="mb-5 stats-cards-row">
//           <Col md={3} className="mb-4">
//             <Card className="shadow-sm border-0 stat-card user-stat-card">
//               <Card.Body className="d-flex align-items-center">
//                 <FaUsers className="stat-icon me-3 user-icon" />
//                 <div><h6 className="text-muted mb-0">Total Users</h6><h2 className="mb-0">{users.length}</h2></div>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3} className="mb-4">
//             <Card className="shadow-sm border-0 stat-card provider-stat-card">
//               <Card.Body className="d-flex align-items-center">
//                 <FaHandsHelping className="stat-icon me-3 provider-icon" />
//                 <div><h6 className="text-muted mb-0">Total Providers</h6><h2 className="mb-0">{providers.length}</h2></div>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3} className="mb-4">
//             <Card className="shadow-sm border-0 stat-card service-stat-card">
//               <Card.Body className="d-flex align-items-center">
//                 <FaConciergeBell className="stat-icon me-3 service-icon" />
//                 <div><h6 className="text-muted mb-0">Total Services</h6><h2 className="mb-0">{services.length}</h2></div>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3} className="mb-4">
//             <Card className="shadow-sm border-0 stat-card booking-stat-card">
//               <Card.Body className="d-flex align-items-center">
//                 <FaCalendarCheck className="stat-icon me-3 booking-icon" />
//                 <div><h6 className="text-muted mb-0">Total Bookings</h6><h2 className="mb-0">{bookings.length}</h2></div>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         <AdminAnalytics />

//         {/* Users Table */}
//         <Card className="shadow-sm mb-5 data-table-card">
//           <Card.Header className="card-header-custom"><h4 className="mb-0">Users Management</h4></Card.Header>
//           <Card.Body>
//             <Table responsive hover className="data-table">
//               <thead>
//                 <tr>
//                   <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th className="text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.length===0 ? <tr><td colSpan="6" className="text-center text-muted">No users found.</td></tr> :
//                   users.map(u => (
//                     <tr key={u.id}>
//                       <td>{u.id}</td>
//                       <td>{u.name}</td>
//                       <td>{u.email}</td>
//                       <td>{u.phoneNumber}</td>
//                       <td>{u.address}</td>
//                       <td className="text-center">
//                         <Button size="sm" variant="outline-danger" onClick={()=>handleDeleteUser(u.id)} title="Delete User"><FaTrashAlt /></Button>
//                       </td>
//                     </tr>
//                   ))
//                 }
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>

//         {/* Providers Table */}
//         <Card className="shadow-sm mb-5 data-table-card">
//           <Card.Header className="card-header-custom"><h4 className="mb-0">Providers Management</h4></Card.Header>
//           <Card.Body>
//             <Table responsive hover className="data-table">
//               <thead>
//                 <tr>
//                   <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th className="text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {providers.length===0 ? <tr><td colSpan="6" className="text-center text-muted">No providers found.</td></tr> :
//                   providers.map(p => (
//                     <tr key={p.id}>
//                       <td>{p.id}</td>
//                       <td>{p.name}</td>
//                       <td>{p.email}</td>
//                       <td>{p.phoneNumber}</td>
//                       <td>{p.address}</td>
//                       <td className="text-center">
//                         <Button size="sm" variant="outline-danger" onClick={()=>handleDeleteProvider(p.id)} title="Delete Provider"><FaTrashAlt /></Button>
//                       </td>
//                     </tr>
//                   ))
//                 }
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>

//             {/* Services Table */}
//           <Card className="shadow-sm mb-5 data-table-card">
//             <Card.Header className="card-header-custom"><h4 className="mb-0">Services Management</h4></Card.Header>
//             <Card.Body>
//               <Table responsive hover className="data-table">
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Name</th>
//                     <th>Price</th>
//                     <th>Provider Name</th>
//                     <th>Provider Phone</th>
//                     <th>Provider Address</th>
//                     <th className="text-center">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {services.length === 0 ? (
//                     <tr>
//                       <td colSpan="7" className="text-center text-muted">No services found.</td>
//                     </tr>
//                   ) : (
//                     services.map(s => (
//                       <tr key={s.id}>
//                         <td>{s.id}</td>
//                         <td>{s.name}</td>
//                         <td>${s.price?.toFixed(2)}</td>
//                         <td>{s.providerName}</td>
//                         <td>{s.providerPhoneNumber}</td>
//                         <td>{s.providerAddress}</td>
//                         <td className="text-center">
//                           <Button
//                             size="sm"
//                             variant="outline-danger"
//                             className="action-button"
//                             onClick={() => handleDeleteService(s.id)}
//                             title="Delete Service"
//                           ><FaTrashAlt /></Button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>


//         {/* Bookings Table */}
//         <Card className="shadow-sm mb-5 data-table-card">
//           <Card.Header className="card-header-custom"><h4 className="mb-0">Bookings Management</h4></Card.Header>
//           <Card.Body>
//             <Table responsive hover className="data-table">
//               <thead><tr><th>ID</th><th>User</th><th>Provider</th><th>Service</th><th>Date</th><th>Status</th><th className="text-center">Actions</th></tr></thead>
//               <tbody>
//                 {bookings.length===0 ? <tr><td colSpan="7" className="text-center text-muted">No bookings found.</td></tr> :
//                   bookings.map(b => (<tr key={b.id}>
//                     <td>{b.id}</td>
//                     <td>{b.userName}</td>
//                     <td>{b.providerName}</td>
//                     <td>{b.serviceName}</td>
//                     <td>{b.date ? new Date(b.date).toLocaleDateString():'N/A'}</td>
//                     <td><Badge bg={getStatusBadgeVariant(b.status)} className="status-badge">{b.status}</Badge></td>
//                     <td className="text-center booking-actions">
//                       <Button size="sm" variant="outline-info" className="action-button me-1" onClick={()=>setSelectedBooking(b)} title="View Details"><FaEye /></Button>
//                       {b.status==="PENDING" && <>
//                         <Button size="sm" variant="outline-success" className="action-button me-1" onClick={()=>handleBookingAction(b.id,"CONFIRMED")} title="Approve Booking"><FaCheckCircle /></Button>
//                         <Button size="sm" variant="outline-warning" className="action-button" onClick={()=>handleBookingAction(b.id,"CANCELLED")} title="Cancel Booking"><FaTimesCircle /></Button>
//                       </>}
//                     </td>
//                   </tr>))}
//               </tbody>
//             </Table>
//           </Card.Body>
//         </Card>

// {/* Reviews Table */}
// <Card className="shadow-sm mb-5 data-table-card">
//   <Card.Header className="card-header-custom d-flex justify-content-between align-items-center">
//     <h4 className="mb-0">Reviews Management AI</h4>
//     <Button
//       size="sm"
//       variant={showFlaggedOnly ? "warning" : "outline-warning"}
//       onClick={() => setShowFlaggedOnly(!showFlaggedOnly)}
//     >
//       ⚠ Flagged ({flaggedCount})
//     </Button>
//   </Card.Header>
//   <Card.Body>
//     <Table responsive hover className="data-table">
//       <thead>
//         <tr>
//           <th>ID</th><th>User</th><th>Provider</th><th>Rating</th>
//           <th>Comment</th><th>AI Analysis</th><th>Date</th><th className="text-center">Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {visibleReviews.length === 0 ? (
//           <tr><td colSpan="8" className="text-center text-muted">No reviews found.</td></tr>
//         ) : (
//           visibleReviews.map((r) => (
//             <tr key={r.id} className={r.flagged ? "table-warning" : ""}>
//               <td>{r.id}</td>
//               <td>{r.userName}</td>
//               <td>{r.providerName}</td>
//               <td>{r.rating} <FaStar className="star-icon" /></td>
//               <td>{r.comment}</td>
//               <td><ReviewInsights review={r} /></td>
//               <td>{r.createdAt}</td>
//               <td className="text-center">
//                 {r.flagged && (
//                   <Button size="sm" variant="outline-success" className="action-button me-1"
//                     onClick={() => handleApproveReview(r.id)} title="Approve (not spam)">
//                     <FaCheckCircle />
//                   </Button>
//                 )}
//                 <Button size="sm" variant="outline-danger" className="action-button"
//                   onClick={() => handleDeleteReview(r.id)} title="Delete Review">
//                   <FaTrashAlt />
//                 </Button>
//               </td>
//             </tr>
//           ))
//         )}
//       </tbody>
//     </Table>
//   </Card.Body>
// </Card>


//         {/* Booking Modal */}
//         <Modal show={!!selectedBooking} onHide={()=>setSelectedBooking(null)} centered>
//           <Modal.Header closeButton className="modal-header-custom">
//             <Modal.Title>Booking Details #{selectedBooking?.id}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body className="modal-body-custom">
//             <p><strong>User:</strong> {selectedBooking?.userName}</p>
//             <p><strong>Provider:</strong> {selectedBooking?.providerName}</p>
//             <p><strong>Service:</strong> {selectedBooking?.serviceName}</p>
//             <p><strong>Date:</strong> {selectedBooking?.date ? new Date(selectedBooking.date).toLocaleDateString():'N/A'}</p>
//             <p><strong>Status:</strong> <Badge bg={getStatusBadgeVariant(selectedBooking?.status)} className="ms-2">{selectedBooking?.status}</Badge></p>
//           </Modal.Body>
//           <Modal.Footer>
//             {selectedBooking?.status==="PENDING" && <>
//               <Button variant="success" onClick={()=>handleBookingAction(selectedBooking.id,"CONFIRMED")}><FaCheckCircle className="me-2"/>Approve</Button>
//               <Button variant="warning" onClick={()=>handleBookingAction(selectedBooking.id,"CANCELLED")}><FaTimesCircle className="me-2"/>Cancel</Button>
//             </>}
//             <Button variant="secondary" onClick={()=>setSelectedBooking(null)}>Close</Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>
//     </div>
//   );
// };

// export default AdminDashboard;

// import React, { useEffect, useState } from "react";
// import {
//   getAllUsers, deleteUser,
//   getAllProviders, deleteProvider,
//   getAllServices, deleteService,
//   getAllBookings, updateBookingStatusAdmin,
//   getAllReviews, deleteReview,
// } from "../../api/adminApi";
// import { Modal, Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { FaTrashAlt, FaCheckCircle, FaTimesCircle, FaEye, FaStar } from "react-icons/fa";
// import "./AdminMinimal.css";
// import ReviewInsights from "../../components/ReviewInsights";
// import { approveReview } from "../../api/aiApi";
// import AdminAnalytics from "./AdminAnalytics";

// const TABS = [
//   { key: "overview", label: "Overview" },
//   { key: "users", label: "Users" },
//   { key: "providers", label: "Providers" },
//   { key: "services", label: "Services" },
//   { key: "bookings", label: "Bookings" },
//   { key: "reviews", label: "Reviews" },
// ];

// const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "N/A");
// const fmtMoney = (v) => (v != null && v !== "" ? `$${Number(v).toFixed(2)}` : "-");

// const StatusPill = ({ status }) => (
//   <span className={`am-pill am-pill-${String(status).toLowerCase()}`}>{status}</span>
// );

// const IconBtn = ({ kind = "", title, onClick, children }) => (
//   <button type="button" className={`am-icon-btn ${kind}`} title={title} onClick={onClick}>
//     {children}
//   </button>
// );

// const Panel = ({ title, right, children }) => (
//   <div className="am-panel">
//     <div className="am-panel-head">
//       <strong>{title}</strong>
//       <div className="d-flex align-items-center gap-2">{right}</div>
//     </div>
//     <div className="table-responsive">{children}</div>
//   </div>
// );

// const Empty = ({ text }) => <div className="am-empty">{text}</div>;

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [providers, setProviders] = useState([]);
//   const [services, setServices] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [tab, setTab] = useState("overview");
//   const [query, setQuery] = useState("");
//   const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);

//   const navigate = useNavigate();

//   const loadData = async () => {
//     setError(null);
//     try {
//       const [u, p, s, b, r] = await Promise.all([
//         getAllUsers(), getAllProviders(), getAllServices(), getAllBookings(), getAllReviews(),
//       ]);
//       setUsers(u || []);
//       setProviders(p || []);
//       setServices(s || []);
//       setBookings(b || []);
//       setReviews(r || []);
//     } catch (err) {
//       console.error("Failed to load dashboard data:", err);
//       setError("Failed to load data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const retry = () => {
//     setLoading(true);
//     loadData();
//   };

//   const confirmThen = (message, action, failMessage) => async () => {
//     if (!window.confirm(message)) return;
//     try { await action(); loadData(); }
//     catch (err) { console.error(err); alert(failMessage); }
//   };

//   const handleDeleteUser = (id) => confirmThen("Delete this user?", () => deleteUser(id), "Failed to delete user")();
//   const handleDeleteProvider = (id) => confirmThen("Delete this provider?", () => deleteProvider(id), "Failed to delete provider")();
//   const handleDeleteService = (id) => confirmThen("Delete this service?", () => deleteService(id), "Failed to delete service")();
//   const handleDeleteReview = (id) => confirmThen("Delete this review?", () => deleteReview(id), "Failed to delete review")();

//   const handleApproveReview = async (id) => {
//     try { await approveReview(id); loadData(); }
//     catch (err) { console.error(err); alert("Failed to approve review"); }
//   };

//   const handleBookingAction = async (id, status) => {
//     try { await updateBookingStatusAdmin(id, status); loadData(); setSelectedBooking(null); }
//     catch (err) { console.error(err); alert(`Failed to update booking status to ${status}`); }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const switchTab = (key) => {
//     setTab(key);
//     setQuery("");
//   };

//   // simple text filter across all primitive fields of a row
//   const q = query.trim().toLowerCase();
//   const match = (row) =>
//     !q ||
//     Object.values(row).some(
//       (v) => v != null && typeof v !== "object" && String(v).toLowerCase().includes(q)
//     );

//   const flaggedCount = reviews.filter((r) => r.flagged).length;
//   const fUsers = users.filter(match);
//   const fProviders = providers.filter(match);
//   const fServices = services.filter(match);
//   const fBookings = bookings.filter(match);
//   const fReviews = reviews.filter((r) => (!showFlaggedOnly || r.flagged) && match(r));

//   const counts = {
//     users: users.length, providers: providers.length, services: services.length,
//     bookings: bookings.length, reviews: reviews.length,
//   };

//   const search = (
//     <input
//       className="am-search"
//       placeholder="Search..."
//       value={query}
//       onChange={(e) => setQuery(e.target.value)}
//     />
//   );

//   if (loading) return <div className="am-root am-state">Loading dashboard...</div>;

//   if (error) return (
//     <div className="am-root am-state">
//       <div>
//         {error}{" "}
//         <button className="am-chip" onClick={retry}>Retry</button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="am-root">
//       <div className="am-container">
//         {/* Top bar */}
//         <div className="am-topbar">
//           <h1 className="am-title">Admin</h1>
//           <button className="am-logout" onClick={handleLogout}>Logout</button>
//         </div>

//         {/* Tabs */}
//         <div className="am-tabs">
//           {TABS.map((t) => (
//             <button
//               key={t.key}
//               className={`am-tab ${tab === t.key ? "active" : ""}`}
//               onClick={() => switchTab(t.key)}
//             >
//               {t.label}
//               {counts[t.key] !== undefined && <span className="am-count">{counts[t.key]}</span>}
//               {t.key === "reviews" && flaggedCount > 0 && <span className="am-dot" title="Flagged reviews">●</span>}
//             </button>
//           ))}
//         </div>

//         {/* Overview: stats + analytics (kept mounted so it loads only once) */}
//         <div style={{ display: tab === "overview" ? "block" : "none" }}>
//           <div className="am-stats">
//             <div className="am-stat"><div className="am-stat-label">Users</div><div className="am-stat-value">{users.length}</div></div>
//             <div className="am-stat"><div className="am-stat-label">Providers</div><div className="am-stat-value">{providers.length}</div></div>
//             <div className="am-stat"><div className="am-stat-label">Services</div><div className="am-stat-value">{services.length}</div></div>
//             <div className="am-stat"><div className="am-stat-label">Bookings</div><div className="am-stat-value">{bookings.length}</div></div>
//           </div>
//           <AdminAnalytics />
//         </div>

//         {/* Users */}
//         {tab === "users" && (
//           <Panel title="Users" right={search}>
//             <table className="am-table">
//               <thead>
//                 <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th></th></tr>
//               </thead>
//               <tbody>
//                 {fUsers.map((u) => (
//                   <tr key={u.id}>
//                     <td className="am-muted">{u.id}</td>
//                     <td>{u.name}</td>
//                     <td>{u.email}</td>
//                     <td>{u.phoneNumber}</td>
//                     <td>{u.address}</td>
//                     <td className="am-right">
//                       <IconBtn kind="danger" title="Delete user" onClick={() => handleDeleteUser(u.id)}><FaTrashAlt /></IconBtn>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {fUsers.length === 0 && <Empty text="No users found." />}
//           </Panel>
//         )}

//         {/* Providers */}
//         {tab === "providers" && (
//           <Panel title="Providers" right={search}>
//             <table className="am-table">
//               <thead>
//                 <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th></th></tr>
//               </thead>
//               <tbody>
//                 {fProviders.map((p) => (
//                   <tr key={p.id}>
//                     <td className="am-muted">{p.id}</td>
//                     <td>{p.name}</td>
//                     <td>{p.email}</td>
//                     <td>{p.phoneNumber}</td>
//                     <td>{p.address}</td>
//                     <td className="am-right">
//                       <IconBtn kind="danger" title="Delete provider" onClick={() => handleDeleteProvider(p.id)}><FaTrashAlt /></IconBtn>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {fProviders.length === 0 && <Empty text="No providers found." />}
//           </Panel>
//         )}

//         {/* Services */}
//         {tab === "services" && (
//           <Panel title="Services" right={search}>
//             <table className="am-table">
//               <thead>
//                 <tr>
//                   <th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Rating</th>
//                   <th>Provider</th><th>Phone</th><th>Address</th><th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {fServices.map((s) => (
//                   <tr key={s.id}>
//                     <td className="am-muted">{s.id}</td>
//                     <td>{s.name}</td>
//                     <td>{s.category}</td>
//                     <td>{fmtMoney(s.price)}</td>
//                     <td>
//                       {s.totalReviews > 0 ? (
//                         <>
//                           <FaStar size={12} style={{ color: "#f59e0b" }} /> {Number(s.averageRating).toFixed(1)}{" "}
//                           <span className="am-muted">({s.totalReviews})</span>
//                         </>
//                       ) : (
//                         <span className="am-muted">-</span>
//                       )}
//                     </td>
//                     <td>{s.providerName}</td>
//                     <td>{s.providerPhoneNumber}</td>
//                     <td>{s.providerAddress}</td>
//                     <td className="am-right">
//                       <IconBtn kind="danger" title="Delete service" onClick={() => handleDeleteService(s.id)}><FaTrashAlt /></IconBtn>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {fServices.length === 0 && <Empty text="No services found." />}
//           </Panel>
//         )}

//         {/* Bookings */}
//         {tab === "bookings" && (
//           <Panel title="Bookings" right={search}>
//             <table className="am-table">
//               <thead>
//                 <tr>
//                   <th>ID</th><th>User</th><th>Provider</th><th>Service</th>
//                   <th>Date</th><th>Price</th><th>Status</th><th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {fBookings.map((b) => (
//                   <tr key={b.id}>
//                     <td className="am-muted">{b.id}</td>
//                     <td>{b.userName}</td>
//                     <td>{b.providerName}</td>
//                     <td>{b.serviceName}</td>
//                     <td>
//                       {fmtDate(b.date)}
//                       {b.startTime && <div className="am-muted">{b.startTime} - {b.endTime}</div>}
//                     </td>
//                     <td>{fmtMoney(b.price)}</td>
//                     <td><StatusPill status={b.status} /></td>
//                     <td className="am-right">
//                       <IconBtn title="View details" onClick={() => setSelectedBooking(b)}><FaEye /></IconBtn>
//                       {b.status === "PENDING" && (
//                         <>
//                           <IconBtn kind="ok" title="Approve booking" onClick={() => handleBookingAction(b.id, "CONFIRMED")}><FaCheckCircle /></IconBtn>
//                           <IconBtn kind="warn" title="Cancel booking" onClick={() => handleBookingAction(b.id, "CANCELLED")}><FaTimesCircle /></IconBtn>
//                         </>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {fBookings.length === 0 && <Empty text="No bookings found." />}
//           </Panel>
//         )}

//         {/* Reviews */}
//         {tab === "reviews" && (
//           <Panel
//             title="Reviews"
//             right={
//               <>
//                 <button
//                   className={`am-chip ${showFlaggedOnly ? "active" : ""}`}
//                   onClick={() => setShowFlaggedOnly(!showFlaggedOnly)}
//                 >
//                   Flagged ({flaggedCount})
//                 </button>
//                 {search}
//               </>
//             }
//           >
//             <table className="am-table">
//               <thead>
//                 <tr>
//                   <th>ID</th><th>User</th><th>Provider</th><th>Rating</th>
//                   <th>Comment</th><th>AI analysis</th><th>Date</th><th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {fReviews.map((r) => (
//                   <tr key={r.id} className={r.flagged ? "am-row-flagged" : ""}>
//                     <td className="am-muted">{r.id}</td>
//                     <td>{r.userName}</td>
//                     <td>{r.providerName}</td>
//                     <td><FaStar size={12} style={{ color: "#f59e0b" }} /> {r.rating}</td>
//                     <td className="am-comment">{r.comment}</td>
//                     <td><ReviewInsights review={r} /></td>
//                     <td className="am-muted">{r.createdAt}</td>
//                     <td className="am-right">
//                       {r.flagged && (
//                         <IconBtn kind="ok" title="Approve (not spam)" onClick={() => handleApproveReview(r.id)}><FaCheckCircle /></IconBtn>
//                       )}
//                       <IconBtn kind="danger" title="Delete review" onClick={() => handleDeleteReview(r.id)}><FaTrashAlt /></IconBtn>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {fReviews.length === 0 && <Empty text="No reviews found." />}
//           </Panel>
//         )}
//       </div>

//       {/* Booking details modal */}
//       <Modal show={!!selectedBooking} onHide={() => setSelectedBooking(null)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title as="h6">Booking #{selectedBooking?.id}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <dl className="am-dl">
//             <dt>User</dt><dd>{selectedBooking?.userName}</dd>
//             <dt>Provider</dt><dd>{selectedBooking?.providerName}</dd>
//             <dt>Service</dt><dd>{selectedBooking?.serviceName}</dd>
//             <dt>Date</dt><dd>{fmtDate(selectedBooking?.date)}</dd>
//             {selectedBooking?.startTime && (
//               <>
//                 <dt>Time</dt><dd>{selectedBooking.startTime} - {selectedBooking.endTime}</dd>
//               </>
//             )}
//             {selectedBooking?.price != null && (
//               <>
//                 <dt>Price</dt><dd>{fmtMoney(selectedBooking.price)}</dd>
//               </>
//             )}
//             <dt>Status</dt><dd>{selectedBooking && <StatusPill status={selectedBooking.status} />}</dd>
//           </dl>
//         </Modal.Body>
//         <Modal.Footer>
//           {selectedBooking?.status === "PENDING" && (
//             <>
//               <Button size="sm" variant="success" onClick={() => handleBookingAction(selectedBooking.id, "CONFIRMED")}>Approve</Button>
//               <Button size="sm" variant="outline-danger" onClick={() => handleBookingAction(selectedBooking.id, "CANCELLED")}>Cancel booking</Button>
//             </>
//           )}
//           <Button size="sm" variant="light" onClick={() => setSelectedBooking(null)}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useState } from "react";
import {
  getAllUsers, deleteUser,
  getAllProviders, deleteProvider,
  getAllServices, deleteService,
  getAllBookings, updateBookingStatusAdmin,
  getAllReviews, deleteReview,
} from "../../api/adminApi";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaChartPie, FaUsers, FaHandsHelping, FaConciergeBell, FaCalendarCheck, FaCommentDots,
  FaStar, FaTrashAlt, FaCheck, FaTimes, FaEye, FaSearch, FaSignOutAlt,
} from "react-icons/fa";
import "./AdminTheme.css";
import ReviewInsights from "../../components/ReviewInsights";
import { approveReview } from "../../api/aiApi";
import AdminAnalytics from "./AdminAnalytics";

/* ---------- helpers ---------- */
const PALETTE = ["#6366f1", "#10b981", "#f59e0b", "#0ea5e9", "#ec4899", "#8b5cf6", "#14b8a6", "#f97316"];
const colorFor = (name) => {
  let h = 0;
  for (const c of String(name || "?")) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
};
const initials = (name) =>
  String(name || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "N/A");
const fmtMoney = (v) => (v != null && v !== "" ? `$${Number(v).toFixed(2)}` : "-");

const Avatar = ({ name, size = 36 }) => (
  <span className="ad-avatar" style={{ width: size, height: size, background: colorFor(name), fontSize: size * 0.38 }}>
    {initials(name)}
  </span>
);

const Stars = ({ value = 0 }) => (
  <span className="ad-stars">
    {[1, 2, 3, 4, 5].map((i) => (
      <FaStar key={i} size={12} style={{ color: i <= value ? "#f59e0b" : "#e5e7eb" }} />
    ))}
  </span>
);

const StatusPill = ({ status }) => (
  <span className={`ad-pill ad-pill-${String(status).toLowerCase()}`}>{status}</span>
);

const IconBtn = ({ kind = "", title, onClick, children }) => (
  <button type="button" className={`ad-ib ${kind}`} title={title} aria-label={title} onClick={onClick}>
    {children}
  </button>
);

const Person = ({ name, sub }) => (
  <div className="ad-person">
    <Avatar name={name} />
    <div>
      <div className="ad-person-name">{name}</div>
      {sub && <div className="ad-sub">{sub}</div>}
    </div>
  </div>
);

const CardHead = ({ title, count, right, bordered = true }) => (
  <div className={`ad-card-head ${bordered ? "bordered" : ""}`}>
    <h3 className="ad-card-title">
      {title}
      {count !== undefined && <span className="ad-count-chip">{count}</span>}
    </h3>
    <div>{right}</div>
  </div>
);

const NAV = [
  { key: "overview", label: "Overview", icon: <FaChartPie /> },
  { key: "users", label: "Users", icon: <FaUsers /> },
  { key: "providers", label: "Providers", icon: <FaHandsHelping /> },
  { key: "services", label: "Services", icon: <FaConciergeBell /> },
  { key: "bookings", label: "Bookings", icon: <FaCalendarCheck /> },
  { key: "reviews", label: "Reviews", icon: <FaCommentDots /> },
];

const META = {
  overview: ["Overview", "A snapshot of your platform"],
  users: ["Users", "Customers registered on the platform"],
  providers: ["Providers", "Service providers and their contact details"],
  services: ["Services", "Everything offered across the platform"],
  bookings: ["Bookings", "Manage and track all bookings"],
  reviews: ["Reviews", "Customer reviews with AI sentiment and moderation"],
};

/* ---------- page ---------- */
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("overview");
  const [query, setQuery] = useState("");
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);

  const navigate = useNavigate();
  const adminName = localStorage.getItem("userName") || "Admin";

  const loadData = async () => {
    setError(null);
    try {
      const [u, p, s, b, r] = await Promise.all([
        getAllUsers(), getAllProviders(), getAllServices(), getAllBookings(), getAllReviews(),
      ]);
      setUsers(u || []);
      setProviders(p || []);
      setServices(s || []);
      setBookings(b || []);
      setReviews(r || []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const retry = () => {
    setLoading(true);
    loadData();
  };

  const confirmThen = (message, action, failMessage) => async () => {
    if (!window.confirm(message)) return;
    try { await action(); loadData(); }
    catch (err) { console.error(err); alert(failMessage); }
  };

  const handleDeleteUser = (id) => confirmThen("Delete this user?", () => deleteUser(id), "Failed to delete user")();
  const handleDeleteProvider = (id) => confirmThen("Delete this provider?", () => deleteProvider(id), "Failed to delete provider")();
  const handleDeleteService = (id) => confirmThen("Delete this service?", () => deleteService(id), "Failed to delete service")();
  const handleDeleteReview = (id) => confirmThen("Delete this review?", () => deleteReview(id), "Failed to delete review")();

  const handleApproveReview = async (id) => {
    try { await approveReview(id); loadData(); }
    catch (err) { console.error(err); alert("Failed to approve review"); }
  };

  const handleBookingAction = async (id, status) => {
    try { await updateBookingStatusAdmin(id, status); loadData(); setSelectedBooking(null); }
    catch (err) { console.error(err); alert(`Failed to update booking status to ${status}`); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const switchTab = (key) => {
    setTab(key);
    setQuery("");
  };

  // text filter across all primitive fields of a row
  const q = query.trim().toLowerCase();
  const match = (row) =>
    !q ||
    Object.values(row).some((v) => v != null && typeof v !== "object" && String(v).toLowerCase().includes(q));

  const flagged = reviews.filter((r) => r.flagged);
  const pending = bookings.filter((b) => b.status === "PENDING");

  const fUsers = users.filter(match);
  const fProviders = providers.filter(match);
  const fServices = services.filter(match);
  const fBookings = bookings.filter(match);
  const fReviews = reviews.filter((r) => (!showFlaggedOnly || r.flagged) && match(r));

  const counts = {
    users: users.length, providers: providers.length, services: services.length,
    bookings: bookings.length, reviews: reviews.length,
  };

  if (loading) return <div className="ad-shell ad-state" style={{ display: "grid" }}>Loading dashboard...</div>;

  if (error) {
    return (
      <div className="ad-shell ad-state" style={{ display: "grid" }}>
        <div className="ad-warn">
          <span>{error}</span>
          <button className="ad-btn-ghost" onClick={retry}>Retry</button>
        </div>
      </div>
    );
  }

  const [title, subtitle] = META[tab];

  return (
    <div className="ad-shell">
      {/* ===== Sidebar ===== */}
      <aside className="ad-sidebar">
        <div className="ad-brand">
          <span className="ad-logo">N</span>
          <div>
            <strong>Service Finder</strong>
            <small>Admin console</small>
          </div>
        </div>

        <nav className="ad-nav">
          {NAV.map((n) => (
            <button
              key={n.key}
              className={`ad-nav-item ${tab === n.key ? "active" : ""}`}
              onClick={() => switchTab(n.key)}
            >
              <span className="ad-nav-icon">{n.icon}</span>
              <span>{n.label}</span>
              {n.key === "reviews" && flagged.length > 0 && <span className="ad-alert-dot" title="Flagged reviews" />}
              {counts[n.key] !== undefined && <span className="ad-nav-count">{counts[n.key]}</span>}
            </button>
          ))}
        </nav>

        <div className="ad-sidebar-foot">
          <div className="ad-me">
            <Avatar name={adminName} size={34} />
            <div>
              <strong>{adminName}</strong>
              <small>Administrator</small>
            </div>
          </div>
          <button className="ad-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* ===== Main ===== */}
      <main className="ad-main">
        <div className="ad-content">
          <header className="ad-header">
            <div>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            {tab !== "overview" && (
              <label className="ad-search">
                <FaSearch />
                <input
                  placeholder={`Search ${title.toLowerCase()}...`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
            )}
          </header>

          {/* ---------- Overview (stays mounted so analytics loads once) ---------- */}
          <div style={{ display: tab === "overview" ? "block" : "none" }}>
            <div className="ad-stats">
              {[
                { label: "Total users", value: users.length, icon: <FaUsers />, bg: "#eef0ff", fg: "#4f46e5" },
                { label: "Providers", value: providers.length, icon: <FaHandsHelping />, bg: "#d1fae5", fg: "#047857" },
                { label: "Services", value: services.length, icon: <FaConciergeBell />, bg: "#fef3c7", fg: "#b45309" },
                { label: "Bookings", value: bookings.length, icon: <FaCalendarCheck />, bg: "#e0f2fe", fg: "#0369a1" },
              ].map((s) => (
                <div key={s.label} className="ad-card ad-stat">
                  <span className="ad-stat-icon" style={{ background: s.bg, color: s.fg }}>{s.icon}</span>
                  <div>
                    <div className="ad-stat-label">{s.label}</div>
                    <div className="ad-stat-value">{s.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* needs attention */}
            <div className="ad-grid-2">
              <div className="ad-card">
                <CardHead title="Pending bookings" count={pending.length} />
                {pending.length === 0 ? (
                  <div className="ad-allclear"><b>All clear</b>No bookings waiting for approval.</div>
                ) : (
                  <>
                    <ul className="ad-list">
                      {pending.slice(0, 5).map((b) => (
                        <li key={b.id}>
                          <div className="ad-list-main">
                            <strong>{b.serviceName}</strong>
                            <span className="ad-sub">{b.userName} → {b.providerName} · {fmtDate(b.date)}</span>
                          </div>
                          <div>
                            <IconBtn kind="ok" title="Approve" onClick={() => handleBookingAction(b.id, "CONFIRMED")}><FaCheck /></IconBtn>
                            <IconBtn kind="warn" title="Cancel" onClick={() => handleBookingAction(b.id, "CANCELLED")}><FaTimes /></IconBtn>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {pending.length > 5 && (
                      <button className="ad-link" onClick={() => switchTab("bookings")}>View all {pending.length} →</button>
                    )}
                  </>
                )}
              </div>

              <div className="ad-card">
                <CardHead title="Flagged reviews" count={flagged.length} />
                {flagged.length === 0 ? (
                  <div className="ad-allclear"><b>All clear</b>No suspicious reviews to moderate.</div>
                ) : (
                  <>
                    <ul className="ad-list">
                      {flagged.slice(0, 5).map((r) => (
                        <li key={r.id}>
                          <div className="ad-list-main">
                            <strong className="ad-clip">{r.comment}</strong>
                            <span className="ad-sub">{r.userName} · {r.providerName}</span>
                          </div>
                          <div>
                            <IconBtn kind="ok" title="Approve (not spam)" onClick={() => handleApproveReview(r.id)}><FaCheck /></IconBtn>
                            <IconBtn kind="danger" title="Delete" onClick={() => handleDeleteReview(r.id)}><FaTrashAlt /></IconBtn>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {flagged.length > 5 && (
                      <button className="ad-link" onClick={() => { setShowFlaggedOnly(true); switchTab("reviews"); }}>
                        View all {flagged.length} →
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <AdminAnalytics />
          </div>

          {/* ---------- Users ---------- */}
          {tab === "users" && (
            <div className="ad-card">
              <CardHead title="All users" count={fUsers.length} />
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr><th>ID</th><th>User</th><th>Phone</th><th>Address</th><th></th></tr>
                  </thead>
                  <tbody>
                    {fUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="ad-id">#{u.id}</td>
                        <td><Person name={u.name} sub={u.email} /></td>
                        <td>{u.phoneNumber}</td>
                        <td>{u.address}</td>
                        <td className="ad-right">
                          <IconBtn kind="danger" title="Delete user" onClick={() => handleDeleteUser(u.id)}><FaTrashAlt /></IconBtn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {fUsers.length === 0 && <div className="ad-empty">No users found.</div>}
            </div>
          )}

          {/* ---------- Providers ---------- */}
          {tab === "providers" && (
            <div className="ad-card">
              <CardHead title="All providers" count={fProviders.length} />
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr><th>ID</th><th>Provider</th><th>Phone</th><th>Address</th><th></th></tr>
                  </thead>
                  <tbody>
                    {fProviders.map((p) => (
                      <tr key={p.id}>
                        <td className="ad-id">#{p.id}</td>
                        <td><Person name={p.name} sub={p.email} /></td>
                        <td>{p.phoneNumber}</td>
                        <td>{p.address}</td>
                        <td className="ad-right">
                          <IconBtn kind="danger" title="Delete provider" onClick={() => handleDeleteProvider(p.id)}><FaTrashAlt /></IconBtn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {fProviders.length === 0 && <div className="ad-empty">No providers found.</div>}
            </div>
          )}

          {/* ---------- Services ---------- */}
          {tab === "services" && (
            <div className="ad-card">
              <CardHead title="All services" count={fServices.length} />
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr><th>ID</th><th>Service</th><th>Price</th><th>Rating</th><th>Provider</th><th>Contact</th><th></th></tr>
                  </thead>
                  <tbody>
                    {fServices.map((s) => (
                      <tr key={s.id}>
                        <td className="ad-id">#{s.id}</td>
                        <td>
                          <div className="ad-person-name">{s.name}</div>
                          {s.category && <span className="ad-tag">{s.category}</span>}
                        </td>
                        <td><strong>{fmtMoney(s.price)}</strong></td>
                        <td>
                          {s.totalReviews > 0 ? (
                            <>
                              <Stars value={Math.round(s.averageRating)} />{" "}
                              <span className="ad-sub">{Number(s.averageRating).toFixed(1)} ({s.totalReviews})</span>
                            </>
                          ) : (
                            <span className="ad-sub">No reviews</span>
                          )}
                        </td>
                        <td><Person name={s.providerName} /></td>
                        <td>
                          <div>{s.providerPhoneNumber}</div>
                          <div className="ad-sub">{s.providerAddress}</div>
                        </td>
                        <td className="ad-right">
                          <IconBtn kind="danger" title="Delete service" onClick={() => handleDeleteService(s.id)}><FaTrashAlt /></IconBtn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {fServices.length === 0 && <div className="ad-empty">No services found.</div>}
            </div>
          )}

          {/* ---------- Bookings ---------- */}
          {tab === "bookings" && (
            <div className="ad-card">
              <CardHead title="All bookings" count={fBookings.length} />
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr><th>ID</th><th>Service</th><th>Customer</th><th>Provider</th><th>When</th><th>Amount</th><th>Status</th><th></th></tr>
                  </thead>
                  <tbody>
                    {fBookings.map((b) => (
                      <tr key={b.id}>
                        <td className="ad-id">#{b.id}</td>
                        <td><strong>{b.serviceName}</strong></td>
                        <td><Person name={b.userName} /></td>
                        <td><Person name={b.providerName} /></td>
                        <td>
                          <div>{fmtDate(b.date)}</div>
                          {b.startTime && <div className="ad-sub">{b.startTime} - {b.endTime}</div>}
                        </td>
                        <td>{fmtMoney(b.price)}</td>
                        <td><StatusPill status={b.status} /></td>
                        <td className="ad-right">
                          <IconBtn title="View details" onClick={() => setSelectedBooking(b)}><FaEye /></IconBtn>
                          {b.status === "PENDING" && (
                            <>
                              <IconBtn kind="ok" title="Approve booking" onClick={() => handleBookingAction(b.id, "CONFIRMED")}><FaCheck /></IconBtn>
                              <IconBtn kind="warn" title="Cancel booking" onClick={() => handleBookingAction(b.id, "CANCELLED")}><FaTimes /></IconBtn>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {fBookings.length === 0 && <div className="ad-empty">No bookings found.</div>}
            </div>
          )}

          {/* ---------- Reviews ---------- */}
          {tab === "reviews" && (
            <div className="ad-card">
              <CardHead
                title="All reviews"
                count={fReviews.length}
                right={
                  <button
                    className={`ad-toggle ${showFlaggedOnly ? "active" : ""}`}
                    onClick={() => setShowFlaggedOnly(!showFlaggedOnly)}
                  >
                    Flagged only ({flagged.length})
                  </button>
                }
              />
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead>
                    <tr><th>ID</th><th>Customer</th><th>Provider</th><th>Rating</th><th>Review &amp; AI analysis</th><th>Date</th><th></th></tr>
                  </thead>
                  <tbody>
                    {fReviews.map((r) => (
                      <tr key={r.id} className={r.flagged ? "flagged" : ""}>
                        <td className="ad-id">#{r.id}</td>
                        <td><Person name={r.userName} /></td>
                        <td><Person name={r.providerName} /></td>
                        <td><Stars value={r.rating} /></td>
                        <td>
                          <div className="ad-review-text">{r.comment}</div>
                          <ReviewInsights review={r} />
                        </td>
                        <td className="ad-sub">{r.createdAt}</td>
                        <td className="ad-right">
                          {r.flagged && (
                            <IconBtn kind="ok" title="Approve (not spam)" onClick={() => handleApproveReview(r.id)}><FaCheck /></IconBtn>
                          )}
                          <IconBtn kind="danger" title="Delete review" onClick={() => handleDeleteReview(r.id)}><FaTrashAlt /></IconBtn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {fReviews.length === 0 && <div className="ad-empty">No reviews found.</div>}
            </div>
          )}
        </div>
      </main>

      {/* ===== Booking details modal ===== */}
      <Modal show={!!selectedBooking} onHide={() => setSelectedBooking(null)} centered dialogClassName="ad-modal">
        <Modal.Header closeButton>
          <Modal.Title as="h6">Booking #{selectedBooking?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <dl className="ad-dl">
            <dt>Service</dt><dd>{selectedBooking?.serviceName}</dd>
            <dt>Customer</dt><dd>{selectedBooking?.userName}</dd>
            <dt>Provider</dt><dd>{selectedBooking?.providerName}</dd>
            <dt>Date</dt><dd>{fmtDate(selectedBooking?.date)}</dd>
            {selectedBooking?.startTime && (
              <>
                <dt>Time</dt><dd>{selectedBooking.startTime} - {selectedBooking.endTime}</dd>
              </>
            )}
            {selectedBooking?.price != null && (
              <>
                <dt>Amount</dt><dd>{fmtMoney(selectedBooking.price)}</dd>
              </>
            )}
            <dt>Status</dt><dd>{selectedBooking && <StatusPill status={selectedBooking.status} />}</dd>
          </dl>
        </Modal.Body>
        <Modal.Footer>
          {selectedBooking?.status === "PENDING" && (
            <>
              <Button size="sm" variant="success" onClick={() => handleBookingAction(selectedBooking.id, "CONFIRMED")}>Approve</Button>
              <Button size="sm" variant="outline-danger" onClick={() => handleBookingAction(selectedBooking.id, "CANCELLED")}>Cancel booking</Button>
            </>
          )}
          <Button size="sm" variant="light" onClick={() => setSelectedBooking(null)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
