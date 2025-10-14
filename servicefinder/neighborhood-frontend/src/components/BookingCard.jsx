import React from 'react';
import { Card, Button } from 'react-bootstrap';

const BookingCard = ({ booking, isProvider = false }) => {
    return (
        <Card className="shadow-sm h-100">
            <Card.Body>
                <Card.Title>{booking.service.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    {isProvider ? `Customer: ${booking.user.name}` : `Provider: ${booking.provider.name}`}
                </Card.Subtitle>
                <Card.Text>
                    <b>Date:</b> {booking.date} <br />
                    <b>Time:</b> {booking.startTime} - {booking.endTime} <br />
                    <b>Price:</b> ${booking.price} <br />
                    <b>Status:</b> <span style={{ color: booking.status === 'CONFIRMED' ? 'green' : booking.status === 'CANCELLED' ? 'red' : 'orange', fontWeight: 'bold' }}>{booking.status}</span>
                </Card.Text>
                <Button href={`/bookings/${booking.id}`} variant="warning" className="w-100">
                    View Details
                </Button>
            </Card.Body>
        </Card>
    );
};

export default BookingCard;
