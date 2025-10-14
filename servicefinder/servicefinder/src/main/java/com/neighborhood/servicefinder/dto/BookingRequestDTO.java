package com.neighborhood.servicefinder.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingRequestDTO {

    private Long serviceId;         // which service user wants
    private LocalDate date;         // Booking date
    private LocalTime startTime;    // Start of time slot
    private LocalTime endTime;      // End of time slot

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
}
