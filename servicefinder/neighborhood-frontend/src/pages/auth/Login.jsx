import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { loginUser } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await loginUser({ email, password });

            // Normalize role (remove "ROLE_" prefix)
            const normalizedRole = response.role.replace("ROLE_", "");

            // Save token, normalized role, and userId
            localStorage.setItem("token", response.token);
            localStorage.setItem("role", normalizedRole);
            localStorage.setItem("userId", response.userId);

            // Redirect based on role
            if (normalizedRole === "USER") navigate("/user/dashboard");
            else if (normalizedRole === "PROVIDER") navigate("/provider/dashboard");
            else if (normalizedRole === "ADMIN") navigate("/admin/dashboard");
        } catch (err) {
            console.error("❌ Login error full:", err);
            setError(err.response?.data || "Login failed. Please try again.");
        }
    };

    return (
        <>
            <Navbar />
            <Container className="my-5">
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <Card className="shadow-sm p-4">
                            <h3 className="text-center mb-4">Login</h3>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Login
                                </Button>
                            </Form>
                            <p className="mt-3 text-center">
                                Don't have an account? <a href="/register">Register</a>
                            </p>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default Login;


