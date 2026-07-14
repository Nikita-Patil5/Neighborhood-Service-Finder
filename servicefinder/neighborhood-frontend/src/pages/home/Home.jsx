
import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// You might want to define these in a separate theme file
const primaryColor = "#667EEA"; // A modern blue-purple
const secondaryColor = "#A78BFA"; // A lighter purple
const textColor = "#374151"; // Dark gray for better readability
const lightBg = "#F9FAFB"; // Light background for sections

const Home = () => {
  const navigate = useNavigate();

  const heroImage =
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1500&q=80";
  const services = [
    {
      title: "Plumbing",
      img: "https://media.istockphoto.com/id/2197665899/photo/plumber-fixing-a-water-leak-in-a-sink-drain-siphon.webp?a=1&b=1&s=612x612&w=0&k=20&c=M7qlYyAwj09YtuTxzzfgx7USfGijevjAFTBqqc3Z79I=",
      desc: "Fix leaks, install pipes, and handle all plumbing needs.",
    },
    {
      title: "Electrician",
      img: "https://plus.unsplash.com/premium_photo-1661911309991-cc81afcce97d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWxlY3RyaWNpYW58ZW58MHx8MHx8fDA%3D",
      desc: "Trusted electricians for safe and reliable solutions.",
    },
    {
      title: "Cleaning",
      img: "https://plus.unsplash.com/premium_photo-1663011218145-c1d0c3ba3542?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xlYW5pbmd8ZW58MHx8MHx8fDA%3D",
      desc: "Get Professional cleaning for home, office, and more.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        className="d-flex align-items-center justify-content-center text-white text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${heroImage}')`,
          height: "90vh", // Slightly taller hero
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: "'Inter', sans-serif", // Modern font
        }}
      >
        <div className="p-5" style={{ maxWidth: "800px" }}>
          <h1 className="display-4 fw-bold mb-3" style={{ fontSize: "3.5rem" }}>
            Find Trusted Local Services Near You.
          </h1>
          <p className="lead mb-4 opacity-75" style={{ fontSize: "1.3rem" }}>
            Book electricians, plumbers, cleaners, and more with just a few clicks.
          </p>
          <Button
            variant="light"
            size="lg"
            className="shadow-sm mt-3"
            style={{
              padding: "0.8rem 2.5rem",
              borderRadius: "0.5rem",
              fontWeight: "600",
              backgroundColor: "white",
              color: primaryColor,
              border: "none",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = primaryColor;
              e.currentTarget.style.color = "white";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = primaryColor;
              e.currentTarget.style.transform = "translateY(0)";
            }}
            onClick={() => navigate("/login")}
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <Container className="my-5 py-5" style={{ backgroundColor: lightBg, borderRadius: "0.75rem" }}>
        <h2 className="text-center mb-5 fw-bold" style={{ color: textColor }}>
          Our Popular Services
        </h2>
        <Row className="g-4">
          {services.map((service, idx) => (
            <Col md={4} key={idx}>
              <Card
                className="h-100 shadow-lg border-0"
                style={{
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.08)";
                }}
              >
                <Card.Img
                  variant="top"
                  src={service.img}
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column p-4">
                  <Card.Title className="fw-bold mb-2" style={{ color: textColor }}>
                    {service.title}
                  </Card.Title>
                  <Card.Text className="mb-3 flex-grow-1" style={{ color: "#6B7280" }}>
                    {service.desc}
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    className="mt-auto"
                    style={{
                      borderColor: primaryColor,
                      color: primaryColor,
                      borderRadius: "0.5rem",
                      padding: "0.6rem 1.5rem",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = primaryColor;
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = primaryColor;
                    }}
                    onClick={() => navigate("/register")}
                  >
                    Book Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Call to Action */}
      <section
        className="text-white text-center p-5 my-5"
        style={{
          background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
          borderRadius: "0.75rem",
          margin: "0 2rem", // Add margin to the sides
        }}
      >
        <h2 className="display-6 fw-bold mb-3">Ready to book your first service?</h2>
        <p className="lead mb-4 opacity-90">
          Sign up now and experience seamless, reliable neighborhood services.
        </p>
        <Button
          variant="light"
          size="lg"
          className="shadow-sm"
          style={{
            padding: "0.8rem 3rem",
            borderRadius: "0.5rem",
            fontWeight: "600",
            backgroundColor: "white",
            color: primaryColor,
            border: "none",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#F3F4F6"; // Slightly darker on hover
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.transform = "translateY(0)";
          }}
          onClick={() => navigate("/register")}
        >
          Register Now
        </Button>
      </section>

      <Footer />
    </>
  );
};

export default Home;
