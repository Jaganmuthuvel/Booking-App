import React, { useState } from 'react';
import { useBooking, type BookingRequest } from '../context/BookingContext';
import { Check, X, Clock, User, Calendar, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
    const { bookings, confirmBooking, rejectBooking } = useBooking();
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'REJECTED'>('PENDING');
    const [rejectId, setRejectId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const filteredBookings = bookings.filter(b =>
        filter === 'ALL' ? true : b.status === filter
    ).sort((a, b) => b.createdAt - a.createdAt);

    const handleReject = (id: string) => {
        if (rejectReason.trim()) {
            rejectBooking(id, rejectReason);
            setRejectId(null);
            setRejectReason('');
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors = {
            PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
            CONFIRMED: 'bg-green-500/20 text-green-400 border-green-500/50',
            REJECTED: 'bg-red-500/20 text-red-400 border-red-500/50'
        };
        return (
            <span className={`status-badge ${colors[status as keyof typeof colors]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="page-container admin-page">
            <div className="admin-header">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="icon-btn">
                        <Home size={24} />
                    </button>
                    <h1>Dashboard</h1>
                </div>
                <div className="tabs">
                    {['ALL', 'PENDING', 'CONFIRMED', 'REJECTED'].map(f => (
                        <button
                            key={f}
                            className={`tab-btn ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f as any)}
                        >
                            {f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bookings-grid">
                {filteredBookings.length === 0 ? (
                    <div className="empty-state">
                        <p>No bookings found in this category.</p>
                    </div>
                ) : (
                    filteredBookings.map((booking: BookingRequest) => (
                        <div key={booking.id} className="booking-card glass-card">
                            <div className="card-header">
                                <h3>{booking.name}</h3>
                                <StatusBadge status={booking.status} />
                            </div>

                            <div className="card-details">
                                <div className="detail-row">
                                    <User size={16} />
                                    <span>{booking.seats} Guests</span>
                                </div>
                                <div className="detail-row">
                                    <Calendar size={16} />
                                    <span>{new Date(booking.time).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-row">
                                    <Clock size={16} />
                                    <span>{new Date(booking.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>

                            {booking.status === 'REJECTED' && (
                                <div className="rejection-reason">
                                    <strong>Reason:</strong> {booking.rejectionReason}
                                </div>
                            )}

                            {booking.status === 'PENDING' && (
                                <div className="card-actions">
                                    {rejectId === booking.id ? (
                                        <div className="reject-input-group">
                                            <input
                                                type="text"
                                                placeholder="Reason for rejection..."
                                                value={rejectReason}
                                                onChange={e => setRejectReason(e.target.value)}
                                                autoFocus
                                            />
                                            <div className="mini-actions">
                                                <button onClick={() => handleReject(booking.id)} className="btn-confirm small">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => setRejectId(null)} className="btn-cancel small">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => confirmBooking(booking.id)}
                                                className="btn-action confirm"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => setRejectId(booking.id)}
                                                className="btn-action reject"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminPage;
