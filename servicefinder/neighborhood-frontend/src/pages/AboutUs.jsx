import React from 'react';
import { FaUsers, FaLightbulb, FaRocket, FaHandshake } from 'react-icons/fa';
import './AboutUs.css'; // Import the CSS for this page


//const teamMember1Image = 'https://via.placeholder.com/150/007bff/ffffff?text=John+Doe';
//const teamMember2Image = 'https://via.placeholder.com/150/28a745/ffffff?text=Jane+Smith';
// const teamMember3Image = 'https://via.placeholder.com/150/ffc107/ffffff?text=Mike+Brown';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-header">
        <h1>About Us</h1>
        <p>Discover our story, mission, and the dedicated team behind the Neighborhood Service Finder.</p>
      </div>

      <section className="about-section story-section">
        <div className="section-icon"><FaLightbulb /></div>
        <h2>Our Story</h2>
        <p>
          The Neighborhood Service Finder was born out of a simple idea: to connect people with reliable local services effortlessly. We noticed a gap in the market for a truly community-centric platform where residents could quickly find trusted professionals and service providers could expand their reach. What started as a small initiative to support local businesses and help neighbors, has grown into a vibrant platform dedicated to fostering stronger, more connected communities.
        </p>
        <p>
          Since our inception in 2025, we've been committed to simplifying the process of finding and offering services, ensuring quality, transparency, and convenience for everyone.
        </p>
      </section>

      <section className="about-section mission-vision-section">
        <div className="mission-vision-card">
          <div className="section-icon"><FaRocket /></div>
          <h3>Our Mission</h3>
          <p>
            To empower individuals and businesses by providing a seamless, trusted platform that connects local service providers with customers, fostering community growth and convenience.
          </p>
        </div>
        <div className="mission-vision-card">
          <div className="section-icon"><FaHandshake /></div>
          <h3>Our Vision</h3>
          <p>
            To be the leading community-driven service marketplace, recognized for its reliability, innovation, and commitment to supporting local economies and improving daily lives.
          </p>
        </div>
      </section>

      <section className="about-section values-section">
        <div className="section-icon"><FaUsers /></div>
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-item">
            <h4>Trust & Transparency</h4>
            <p>Building strong relationships through honesty and clear communication.</p>
          </div>
          <div className="value-item">
            <h4>Community Focus</h4>
            <p>Prioritizing local connections and supporting neighborhood development.</p>
          </div>
          <div className="value-item">
            <h4>Excellence & Innovation</h4>
            <p>Striving for quality in every service and continuously improving our platform.</p>
          </div>
          <div className="value-item">
            <h4>Empowerment</h4>
            <p>Giving individuals and small businesses the tools to succeed.</p>
          </div>
        </div>
      </section>

      {/* <section className="about-section team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member-card">
            <img src={teamMember1Image} alt="John Doe" className="team-member-img" />
            <h4>John Doe</h4>
            <p className="team-title">Founder & CEO</p>
            <p className="team-bio">John envisioned a world where finding a local handyman was as easy as ordering food online. His passion for community drives our platform forward.</p>
          </div>
          <div className="team-member-card">
            <img src={teamMember2Image} alt="Jane Smith" className="team-member-img" />
            <h4>Jane Smith</h4>
            <p className="team-title">Head of Operations</p>
            <p className="team-bio">Jane ensures that every booking and every service delivery runs smoothly, making sure both customers and providers have a great experience.</p>
          </div>
          <div className="team-member-card">
            <img src={teamMember3Image} alt="Mike Brown" className="team-member-img" />
            <h4>Mike Brown</h4>
            <p className="team-title">Lead Developer</p>
            <p className="team-bio">Mike is the wizard behind the curtain, constantly innovating and building the robust features that make the Neighborhood Service Finder so powerful.</p>
          </div>
        </div>
      </section> */}

    </div>
  );
};

export default AboutUs;