import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFetchUserEventBookings } from './services/FetchUserEventBookings.services';
import { useUpdateEventBooking } from './services/UpdateEventBooking.services';
import { useCancelEventBooking } from './services/CancelEventBooking.services';
import { toast } from 'react-toastify';
import EventPlaceImage from '../../assets/event.png';

const SkeletonCard = () => (
    <div className="bg-[#1f2227] rounded-lg shadow-lg overflow-hidden border border-gray-700 flex flex-col animate-pulse">
        <div className="w-full h-48 bg-gray-800"></div>
        <div className="p-5 flex-grow">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
            <div className="space-y-1">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 mt-2"></div>
            </div>
        </div>
        <div className="p-5 border-t border-gray-700 flex justify-end gap-3">
            <div className="h-10 w-20 bg-gray-700 rounded"></div>
            <div className="h-10 w-20 bg-gray-700 rounded"></div>
        </div>
    </div>
);

const MyBookingsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 6;

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useFetchUserEventBookings({
        page: currentPage,
        onError: (err) => {
            toast.error(`Failed to load your bookings: ${err.message || 'Unknown error'}`);
            console.error("Failed to fetch user event bookings:", err);
        },
    });

    const bookings = Array.isArray(data?.results) ? data.results : [];
    const totalBookingCount = data?.count || 0;

    const { mutate: updateBooking, isLoading: isUpdating } = useUpdateEventBooking();
    const { mutate: cancelBooking, isLoading: isCancelling } = useCancelEventBooking();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [modalFormData, setModalFormData] = useState({
        booking_date: '',
        start_time: '',
        end_time: '',
        number_of_guests: '',
        event_type: '',
    });

    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);
    const [countdown, setCountdown] = useState(10);
    const countdownIntervalRef = useRef(null);

    useEffect(() => {
        if (selectedBooking) {
            setModalFormData({
                booking_date: selectedBooking.booking_date,
                start_time: selectedBooking.start_time,
                end_time: selectedBooking.end_time,
                number_of_guests: selectedBooking.number_of_guests,
                event_type: selectedBooking.event_type,
            });
        }
    }, [selectedBooking]);

    const handleConfirmCancel = useCallback(() => {
        if (bookingToCancel && !isCancelling) {
            setIsCancelConfirmOpen(false);
            clearInterval(countdownIntervalRef.current);
            setCountdown(10);

            cancelBooking(bookingToCancel.id, {
                onSuccess: () => {
                    toast.success("Booking cancelled successfully!");
                    refetch();
                    setBookingToCancel(null);
                },
                onError: (err) => {
                    toast.error(`Failed to cancel booking: ${err.message || 'Unknown error'}`);
                    console.error("Cancellation error:", err);
                },
            });
        }
    }, [bookingToCancel, isCancelling, cancelBooking, refetch]);

    useEffect(() => {
        if (isCancelConfirmOpen && countdown > 0) {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
            countdownIntervalRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownIntervalRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (countdown === 0 && isCancelConfirmOpen) {
            handleConfirmCancel();
        }
        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        };
    }, [isCancelConfirmOpen, countdown, handleConfirmCancel]);

    const formatTime = (timeString) => {
        try {
            const [hour, minute] = timeString.split(':');
            const h = parseInt(hour, 10);
            const suffix = h >= 12 ? 'PM' : 'AM';
            const hour12 = h % 12 || 12;
            return `${hour12}:${minute} ${suffix}`;
        } catch (e) {
            console.error("Error formatting time:", e);
            return timeString;
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleEditClick = (booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    const handleCancelClick = (booking) => {
        setBookingToCancel(booking);
        setCountdown(10);
        setIsCancelConfirmOpen(true);
    };

    const handleCancelConfirmClose = () => {
        setIsCancelConfirmOpen(false);
        setBookingToCancel(null);
        setCountdown(10);
        clearInterval(countdownIntervalRef.current);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
        setModalFormData({
            booking_date: '',
            start_time: '',
            end_time: '',
            number_of_guests: '',
            event_type: '',
        });
    };

    const handleModalInputChange = (e) => {
        const { name, value } = e.target;
        setModalFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleModalSubmit = (e) => {
        e.preventDefault();
        if (!selectedBooking) return;

        const selectedDate = new Date(modalFormData.booking_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            toast.error("Booking date cannot be in the past.");
            return;
        }

        const newStartTime = new Date(`${modalFormData.booking_date}T${modalFormData.start_time}:00`);
        const newEndTime = new Date(`${modalFormData.booking_date}T${modalFormData.end_time}:00`);

        if (newStartTime >= newEndTime) {
            toast.error("End time must be after start time.");
            return;
        }

        const dataToSend = {
            booking_date: modalFormData.booking_date,
            start_time: modalFormData.start_time,
            end_time: modalFormData.end_time,
            number_of_guests: parseInt(modalFormData.number_of_guests, 10),
            event_type: modalFormData.event_type,
        };

        updateBooking(
            { id: selectedBooking.id, data: dataToSend },
            {
                onSuccess: () => {
                    toast.success("Booking updated successfully!");
                    handleModalClose();
                    refetch();
                },
                onError: (err) => {
                    const errorMsg =
                        err.response?.data?.detail ||
                        err.response?.data?.non_field_errors?.[0] ||
                        "Failed to update booking.";
                    toast.error(errorMsg);
                    console.error("Update error:", err.response?.data || err);
                },
            }
        );
    };

    const totalPages = Math.ceil(totalBookingCount / bookingsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto px-4 py-8 pt-24 min-h-[calc(100vh-160px)]">
            <h1 className="text-3xl font-bold text-white mb-6">My Event Bookings</h1>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: bookingsPerPage }).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            ) : isError ? (
                <div className="text-center py-20 pt-24 text-red-500">Error loading bookings: {error.message}</div>
            ) : bookings.length === 0 ? (
                <p className="text-gray-400 text-lg text-center py-10">You have no upcoming event bookings.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-[#1f2227] rounded-lg shadow-lg overflow-hidden border border-gray-700 flex flex-col"
                            >
                                <img
                                    src={booking.event_place?.images?.[0]?.image || EventPlaceImage}
                                    alt={booking.event_place?.name || 'Event Place'}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = EventPlaceImage; }}
                                />
                                <div className="p-5 flex-grow">
                                    <h2 className="text-xl font-semibold text-white mb-2">
                                        {booking.event_place?.name || 'Event Place Name'}
                                    </h2>
                                    <p className="text-gray-400 text-sm mb-3">
                                        {booking.event_place?.location || 'Location not available'}
                                    </p>
                                    <div className="space-y-1 text-gray-300 text-sm">
                                        <p>
                                            <span className="font-semibold">Date:</span> {formatDate(booking.booking_date)}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Time:</span> {formatTime(booking.start_time)} -{' '}
                                            {formatTime(booking.end_time)}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Guests:</span> {booking.number_of_guests}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Event Type:</span> {booking.event_type}
                                        </p>
                                        <p
                                            className={`font-semibold mt-2 ${
                                                booking.status === 'confirmed'
                                                    ? 'text-green-400'
                                                    : booking.status === 'pending'
                                                        ? 'text-yellow-400'
                                                        : 'text-red-400'
                                            }`}
                                        >
                                            Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5 border-t border-gray-700 flex justify-end gap-3">
                                    <button
                                        onClick={() => handleEditClick(booking)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition duration-200"
                                        disabled={booking.status === 'cancelled' || booking.status === 'completed'}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleCancelClick(booking)}
                                        className={`font-bold py-2 px-4 rounded text-sm transition duration-200 ${
                                            booking.status === 'cancelled' || booking.status === 'completed'
                                                ? 'bg-gray-600 cursor-not-allowed'
                                                : 'bg-red-600 hover:bg-red-700'
                                        }`}
                                        disabled={booking.status === 'cancelled' || booking.status === 'completed'}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8 space-x-2">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => paginate(index + 1)}
                                    className={`px-4 py-2 rounded-lg font-bold transition-colors duration-200
                                        ${
                                            currentPage === index + 1
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {isModalOpen && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1f2227] rounded-lg shadow-xl p-6 w-full max-w-lg relative text-white max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4 text-center">Edit Booking for {selectedBooking.event_place?.name}</h2>
                        <button
                            onClick={handleModalClose}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white text-3xl font-bold leading-none"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>

                        <form onSubmit={handleModalSubmit} className="grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="modal_booking_date" className="block text-gray-300 text-sm font-bold mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    id="modal_booking_date"
                                    name="booking_date"
                                    value={modalFormData.booking_date}
                                    onChange={handleModalInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="modal_start_time" className="block text-gray-300 text-sm font-bold mb-1">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        id="modal_start_time"
                                        name="start_time"
                                        value={modalFormData.start_time}
                                        onChange={handleModalInputChange}
                                        className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="modal_end_time" className="block text-gray-300 text-sm font-bold mb-1">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        id="modal_end_time"
                                        name="end_time"
                                        value={modalFormData.end_time}
                                        onChange={handleModalInputChange}
                                        className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="modal_number_of_guests" className="block text-gray-300 text-sm font-bold mb-1">
                                    Number of Guests
                                </label>
                                <input
                                    type="number"
                                    id="modal_number_of_guests"
                                    name="number_of_guests"
                                    value={modalFormData.number_of_guests}
                                    onChange={handleModalInputChange}
                                    min="1"
                                    className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="modal_event_type" className="block text-gray-300 text-sm font-bold mb-1">
                                    Type of Event
                                </label>
                                <select
                                    id="modal_event_type"
                                    name="event_type"
                                    value={modalFormData.event_type}
                                    onChange={handleModalInputChange}
                                    className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select an event type</option>
                                    <option value="Wedding">Wedding</option>
                                    <option value="Birthday Party">Birthday Party</option>
                                    <option value="Corporate Event">Corporate Event</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-1">Current Status</label>
                                <p
                                    className={`py-2 px-3 rounded w-full ${
                                        selectedBooking.status === 'confirmed'
                                            ? 'text-green-400 bg-green-900'
                                            : selectedBooking.status === 'pending'
                                                ? 'text-yellow-400 bg-yellow-900'
                                                : 'text-red-400 bg-red-900'
                                    }`}
                                >
                                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                    Status can only be changed by the event place owner or admin.
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                                        isUpdating ? 'bg-blue-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? 'Updating...' : 'Update Booking'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isCancelConfirmOpen && bookingToCancel && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-red-900 border border-red-700 rounded-lg shadow-xl p-6 w-full max-w-sm relative text-white text-center">
                        <button
                            onClick={handleCancelConfirmClose}
                            className="absolute top-3 right-3 text-red-300 hover:text-white text-3xl font-bold leading-none"
                            aria-label="Close warning"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Warning!</h2>
                        <p className="mb-4">
                            You are about to cancel your booking for{' '}
                            <span className="font-semibold">{bookingToCancel.event_place?.name || 'this event place'}</span> on{' '}
                            <span className="font-semibold">{formatDate(bookingToCancel.booking_date)}</span>.
                        </p>
                        <p className="mb-6 text-lg">
                            This action cannot be undone. Cancellation will proceed in{' '}
                            <span className="font-bold text-yellow-300 text-2xl">{countdown}</span> seconds.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleCancelConfirmClose}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                            >
                                Keep Booking
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                disabled={isCancelling || countdown > 0}
                                className={`font-bold py-2 px-4 rounded transition duration-200 ${
                                    isCancelling || countdown > 0 ? 'bg-red-800 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {isCancelling ? 'Cancelling...' : `Cancel Now`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;