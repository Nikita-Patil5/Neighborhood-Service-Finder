import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ServiceCard = ({ service }) => {
    return (
        <Card className="h-100 shadow-sm">
            <Card.Img variant="top" src={service.image || '/images/default-service.jpg'} style={{ height: '180px', objectFit: 'cover' }} />
            <Card.Body className="d-flex flex-column">
                <Card.Title>{service.name}</Card.Title>
                <Card.Text className="text-muted">{service.category}</Card.Text>
                <Card.Text className="fw-bold">${service.price}</Card.Text>
                <Button variant="primary" className="mt-auto">Book Now</Button>
            </Card.Body>
        </Card>
    );
};

export default ServiceCard;
