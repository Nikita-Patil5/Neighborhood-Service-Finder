
import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './ContactUs.css'; 

const ContactUs = () => {
  // You would typically use state for form inputs and handle submission here
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you shortly.');
    // In a real app, you'd send this data to your backend API
    // e.g., axios.post('/api/contact', { name, email, message });
  };

  return (
    <div className="contact-us-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Please fill out the form below or reach out to us using our contact details.</p>
      </div>

      <div className="contact-content">
        <div className="contact-details">
          <h3>Our Information</h3>
          <div className="detail-item">
            <FaMapMarkerAlt className="contact-icon" />
            <p>123 Chinchwad, Pune, Maharashtra 411002</p>
          </div>
          <div className="detail-item">
            <FaPhone className="contact-icon" />
            <p>+91 9921601613</p>
          </div>
          <div className="detail-item">
            <FaEnvelope className="contact-icon" />
            <p>support@neighborhoodservice.com</p>
          </div>

          <h3 className="social-heading">Follow Us</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook className="social-icon facebook" /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter className="social-icon twitter" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram className="social-icon instagram" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin className="social-icon linkedin" /></a>
          </div>
        </div>

        <div className="contact-form-section">
          <h3>Send Us a Message</h3>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea id="message" name="message" rows="6" required></textarea>
            </div>
            <button type="submit" className="btn primary-btn">Send Message</button>
          </form>
        </div>
      </div>

      {/* Optional: Add a map section */}
      <div className="map-section">
        <h3>Find Us on the Map</h3>
        {/* Placeholder for an embedded map (e.g., Google Maps iframe) */}
        <div className="map-placeholder">
          <p>Map loading...</p>
          {/* Example Google Maps Embed (replace with your actual location) */}
          { <iframe
            title="Our Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242117.70907005566!2d73.69815332166222!3d18.52487061053574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1759138967362!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe> }
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

