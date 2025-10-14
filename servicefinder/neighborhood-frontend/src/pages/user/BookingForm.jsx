import React, { useEffect, useState } from "react";
import { getAllServices, createBooking, getReviewsForService, addReview } from "../../api/userApi";
import DatePicker from "react-datepicker";
import { useNavigate, useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

const BookingForm = () => {
  const location = useLocation();
  const preselectedService = location.state?.serviceId || "";
  const [selectedService, setSelectedService] = useState(preselectedService);
  const [services, setServices] = useState([]);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const navigate = useNavigate();

  useEffect(() => {
    getAllServices()
      .then(res => setServices(res))
      .catch(err => console.error(err));
  }, []);

  const selectedServiceObj = services.find(s => s.id === selectedService);

  // Fetch reviews whenever service changes
  useEffect(() => {
    if (!selectedService) return;
    getReviewsForService(selectedService)
      .then(data => setReviews(data))
      .catch(err => console.error("Error fetching reviews:", err));
  }, [selectedService]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !startTime || !endTime) {
      alert("Please fill all fields");
      return;
    }

    const bookingData = {
      serviceId: selectedService,
      date: date.toISOString().split("T")[0],
      startTime: startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      endTime: endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setLoading(true);
    try {
      await createBooking(bookingData);
      alert("Booking created successfully!");
      navigate("/user");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async () => {
    if (!newReview.comment) {
      alert("Comment cannot be empty");
      return;
    }
    try {
      await addReview({ ...newReview, serviceId: selectedService });
      alert("Review added successfully!");
      setNewReview({ rating: 5, comment: "" });
      const updatedReviews = await getReviewsForService(selectedService);
      setReviews(updatedReviews);
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Failed to add review");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Book a Service</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <label>Choose Service</label>
          <select
            className="form-select"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Provider info */}
        {selectedServiceObj && (
          <div className="mb-3 p-3 bg-white rounded shadow-sm">
            <p><strong>Provider:</strong> {selectedServiceObj.providerName}</p>
            <p><strong>Phone:</strong> {selectedServiceObj.phoneNumber || "N/A"}</p>
            <p><strong>Address:</strong> {selectedServiceObj.address || "N/A"}</p>
            <p><strong>Average Rating:</strong> {selectedServiceObj.avgRating?.toFixed(1) || "No reviews yet"} ⭐</p>
          </div>
        )}

        <div className="mb-3">
          <label>Select Date</label>
          <DatePicker
            className="form-control"
            selected={date}
            onChange={(d) => setDate(d)}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            required
          />
        </div>

        <div className="mb-3 row">
          <div className="col-md-6">
            <label>Start Time</label>
            <DatePicker
              className="form-control"
              selected={startTime}
              onChange={(time) => setStartTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Start Time"
              dateFormat="HH:mm"
              required
            />
          </div>
          <div className="col-md-6">
            <label>End Time</label>
            <DatePicker
              className="form-control"
              selected={endTime}
              onChange={(time) => setEndTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="End Time"
              dateFormat="HH:mm"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Booking..." : "Book Now"}
        </button>
      </form>

      {/* Reviews section */}
      {selectedService && (
        <div className="mt-5">
          <h4>Reviews</h4>
          {reviews.length === 0 ? (
            <p>No reviews yet</p>
          ) : (
            <ul className="list-group">
              {reviews.map((r) => (
                <li key={r.id} className="list-group-item">
                  <strong>{r.userName}</strong>: {r.comment} ({r.rating} ⭐)
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3">
            <h5>Add Review</h5>
            <select
              className="form-select mb-2 w-25"
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: +e.target.value })}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <textarea
              className="form-control mb-2"
              placeholder="Write your review..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            />
            <button className="btn btn-secondary" onClick={handleAddReview}>Submit Review</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;



