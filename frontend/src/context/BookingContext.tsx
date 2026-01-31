import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED';

export interface BookingRequest {
    id: string;
    name: string;
    seats: number;
    time: string;
    status: BookingStatus;
    rejectionReason?: string;
    createdAt: number;
}

interface BookingContextType {
    bookings: BookingRequest[];
    addBooking: (booking: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>) => void;
    confirmBooking: (id: string) => void;
    rejectBooking: (id: string, reason: string) => void;
    getPendingCount: () => number;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bookings, setBookings] = useState<BookingRequest[]>(() => {
        const saved = localStorage.getItem('bookings');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('bookings', JSON.stringify(bookings));
    }, [bookings]);

    const addBooking = (bookingData: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>) => {
        const newBooking: BookingRequest = {
            ...bookingData,
            id: crypto.randomUUID(),
            status: 'PENDING',
            createdAt: Date.now(),
        };
        setBookings(prev => [newBooking, ...prev]);
    };

    const confirmBooking = (id: string) => {
        setBookings(prev =>
            prev.map(b => (b.id === id ? { ...b, status: 'CONFIRMED' } : b))
        );
    };

    const rejectBooking = (id: string, reason: string) => {
        setBookings(prev =>
            prev.map(b => (b.id === id ? { ...b, status: 'REJECTED', rejectionReason: reason } : b))
        );
    };

    const getPendingCount = () => {
        return bookings.filter(b => b.status === 'PENDING').length;
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking, confirmBooking, rejectBooking, getPendingCount }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};
