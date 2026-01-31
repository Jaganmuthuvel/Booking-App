import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Calendar, Clock, Users, UtensilsCrossed, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerPage: React.FC = () => {
    const { addBooking } = useBooking();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        seats: 2,
        date: '',
        time: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.date || !formData.time) return;

        addBooking({
            name: formData.name,
            seats: formData.seats,
            time: `${formData.date} ${formData.time}`
        });

        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', seats: 2, date: '', time: '' });
        }, 3000);
    };

    return (
        <div className="page-container customer-page">
            <div className="glass-card full-height-center">
                <div className="content-wrapper">
                    <div className="header-section">
                        <div className="icon-wrapper">
                            <UtensilsCrossed size={40} className="brand-icon" />
                        </div>
                        <h1>Reserve a Table</h1>
                        <p>Experience fine dining at its best.</p>
                    </div>

                    {isSubmitted ? (
                        <div className="success-message fade-in">
                            <CheckCircle size={64} className="success-icon" />
                            <h2>Request Received!</h2>
                            <p>We will confirm your booking shortly.</p>
                            <button onClick={() => setIsSubmitted(false)} className="btn primary-btn">
                                Make Another Booking
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="booking-form">
                            <div className="form-group">
                                <label>Name</label>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Number of Guests</label>
                                <div className="guests-selector">
                                    <Users size={20} />
                                    <input
                                        type="range"
                                        min="1"
                                        max="12"
                                        value={formData.seats}
                                        onChange={e => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                                    />
                                    <span className="seat-count">{formData.seats}</span>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Date</label>
                                    <div className="input-with-icon">
                                        <Calendar size={18} className="input-icon" />
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>

                                <div className="form-group half">
                                    <label>Time</label>
                                    <div className="input-with-icon">
                                        <Clock size={18} className="input-icon" />
                                        <input
                                            type="time"
                                            value={formData.time}
                                            onChange={e => setFormData({ ...formData, time: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn primary-btn pulse-on-hover">
                                Book Table
                            </button>
                        </form>
                    )}

                    <div className="admin-link">
                        <span onClick={() => navigate('/admin')}>Are you an admin?</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerPage;
