import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFetchEventPlaceDetail } from './services/FetchEventPlaceDetail.services';
import { useCreateEventBooking } from './services/Booking.services';
import EventPlaceImage from '../../assets/event.png';

const EventPlaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: place, isLoading, isError, error, refetch: refetchEventPlaceDetail } = useFetchEventPlaceDetail(id);

  const {
    mutate: createBooking,
    isLoading: isBookingLoading,
    isSuccess: isBookingSuccess,
    error: bookingError,
    reset: resetBookingMutation
  } = useCreateEventBooking(toast, refetchEventPlaceDetail);

  const initialBookingState = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return {
      booking_date: `${year}-${month}-${day}`,
      start_time: '09:00',
      end_time: '17:00',
      number_of_guests: 50,
      event_type: 'Wedding',
    };
  };

  const [bookingDetails, setBookingDetails] = useState(initialBookingState);
  const [latestBookedUntil, setLatestBookedUntil] = useState(null);

  useEffect(() => {
    if (!isLoading && !isError && !place) {
      navigate('/Spaces');
      toast.error("Event space not found!");
    }
  }, [isLoading, isError, place, navigate]);

  useEffect(() => {
    if (isBookingSuccess) {
      setBookingDetails(initialBookingState());
      const timer = setTimeout(() => resetBookingMutation(), 5000);
      return () => clearTimeout(timer);
    }
  }, [isBookingSuccess, resetBookingMutation]);

  useEffect(() => {
    if (place && place.bookings && place.bookings.length > 0) {
      let latestEnd = null;

      place.bookings.forEach(booking => {
        const bookingDateTime = new Date(`${booking.booking_date}T${booking.end_time}`);
        if (!latestEnd || bookingDateTime > latestEnd) {
          latestEnd = bookingDateTime;
        }
      });
      setLatestBookedUntil(latestEnd);
    } else {
      setLatestBookedUntil(null);
    }
  }, [place]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({ ...prev, [name]: value }));
    if (bookingError) {
      resetBookingMutation();
    }
  };

  const isTimeSlotBooked = useMemo(() => {
    if (!place || !place.bookings || !bookingDetails.booking_date || !bookingDetails.start_time || !bookingDetails.end_time) {
      return false;
    }

    const { booking_date, start_time, end_time } = bookingDetails;
    const newStartTime = new Date(`${booking_date}T${start_time}:00`);
    const newEndTime = new Date(`${booking_date}T${end_time}:00`);

    if (newStartTime >= newEndTime) {
      return true;
    }

    return place.bookings.some(existingBooking => {
      const existingStartDate = new Date(`${existingBooking.booking_date}T${existingBooking.start_time}:00`);
      const existingEndDate = new Date(`${existingBooking.booking_date}T${existingBooking.end_time}:00`);

      return newStartTime < existingEndDate && newEndTime > existingStartDate;
    });
  }, [place, bookingDetails]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!place) return;

    const selectedDate = new Date(bookingDetails.booking_date);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (selectedDate < today) {
        toast.error("Booking date cannot be in the past.");
        return;
    }

    const startHour = parseInt(bookingDetails.start_time.split(':')[0]);
    const endHour = parseInt(bookingDetails.end_time.split(':')[0]);

    if (startHour >= endHour) {
      toast.error("End time must be after start time.");
      return;
    }

    if (bookingDetails.number_of_guests > place.capacity) {
      toast.error(`Number of guests (${bookingDetails.number_of_guests}) exceeds event place capacity (${place.capacity}).`);
      return;
    }

    if (isTimeSlotBooked) {
      toast.error("The selected time slot overlaps with an existing booking. Please choose another time.");
      return;
    }

    const dataToSend = {
      event_place_id: place.id,
      booking_date: bookingDetails.booking_date,
      start_time: bookingDetails.start_time,
      end_time: bookingDetails.end_time,
      number_of_guests: parseInt(bookingDetails.number_of_guests, 10),
      event_type: bookingDetails.event_type,
      status: 'booked'
    };

    createBooking(dataToSend);
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 pt-24 text-white">Loading event space details...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 pt-24 text-red-500">Error loading event space: {error.message}</div>
    );
  }

  if (!place) {
    return (
      <div className="text-center py-20 pt-24 text-gray-400">Event space not found.</div>
    );
  }

  const formatTime = (timeString) => {
    try {
      const [hour, minute] = timeString.split(':');
      const h = parseInt(hour, 10);
      const suffix = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      return `${hour12}:${minute} ${suffix}`;
    } catch (e) {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getBookingErrorMessage = () => {
    if (!bookingError || !bookingError.response || !bookingError.response.data) {
      return 'An unexpected error occurred. Please try again.';
    }

    const data = bookingError.response.data;
    if (data.non_field_errors && data.non_field_errors.length > 0) {
      return data.non_field_errors[0];
    }
    if (data.detail) {
      return data.detail;
    }
    if (data.event_place_id && data.event_place_id[0] === "The fields event_place_id, booking_date, start_time, end_time must make a unique set.") {
        return "This event place is already booked for the exact date and time you selected. Please choose a different slot.";
    }
    for (const key in data) {
      if (Array.isArray(data[key]) && data[key].length > 0) {
        return `${key}: ${data[key][0]}`;
      }
    }
    return 'An unexpected error occurred. Please try again.';
  };


  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-[calc(100vh-160px)]">
      <div className="bg-[#1f2227] rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={place.images && place.images.length > 0 ? place.images[0].image : EventPlaceImage}
            alt={place.name}
            className="w-full md:w-1/2 h-80 object-cover rounded-lg"
          />
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold text-white mb-2">{place.name}</h1>
            <p className="text-gray-400 text-lg mb-4">{place.location}</p>
            <p className="text-blue-400 font-bold text-2xl mb-4">₹{parseFloat(place.price_per_hour).toFixed(2)}/hr</p>
            <p className="text-gray-300 mb-4">{place.description}</p>

            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-2">Details:</h3>
              <p className="text-gray-300">Capacity: {place.capacity} guests</p>
              <p className="text-gray-300">Categories: {place.category}</p>
              <p className={`font-semibold ${place.is_available_now ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  Overall Status: {place.is_available_now ? 'Generally Available' : 'Currently Unavailable (by admin)'}
                  <span
                    className="ml-2 text-gray-500 cursor-help"
                    title="This status indicates the general availability of the venue as set by the owner/admin (e.g., open for business, closed for renovations), not specific booking availability."
                  >
                    &#9432;
                  </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {place.bookings && place.bookings.length > 0 && (
        <div className="bg-[#1f2227] rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Upcoming Booked & Pending Slots</h2>
          <p className="text-gray-400 mb-4">The following time slots are already booked or pending confirmation for this event space:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {place.bookings.map((booking, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-md border border-gray-700">
                <p className="text-white text-lg font-semibold mb-1">Date: {booking.booking_date}</p>
                <p className="text-gray-300 text-sm">
                  Time: {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                </p>
                <p className={`font-medium text-sm mt-1 ${booking.status === 'confirmed' ? 'text-green-400' : 'text-yellow-400'}`}>
                  Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#1f2227] rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Book This Space</h2>

        {latestBookedUntil && (
            <p className="text-yellow-400 text-md mb-4 font-semibold">
                This hall is currently booked until: {formatDate(latestBookedUntil.toISOString().split('T')[0])} at {formatTime(latestBookedUntil.toTimeString().split(' ')[0])} (Local Time)
            </p>
        )}

        {isBookingSuccess && (
            <div className="bg-green-700 p-4 rounded-md mb-4 flex justify-between items-center text-white">
                <div>
                    <p className="font-bold text-lg">Booking Successful!</p>
                    <p>Your request has been submitted.</p>
                </div>
                <button
                    onClick={() => navigate('/my-bookings')}
                    className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
                >
                    Go to My Bookings
                </button>
            </div>
        )}

        {bookingError && (
            <div className="bg-red-700 p-4 rounded-md mb-4 text-white">
                <p className="font-bold text-lg">Booking Failed!</p>
                <p>{getBookingErrorMessage()}</p>
            </div>
        )}

        <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="booking_date" className="block text-gray-300 text-sm font-bold mb-2">Date</label>
            <input
              type="date"
              id="booking_date"
              name="booking_date"
              value={bookingDetails.booking_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="start_time" className="block text-gray-300 text-sm font-bold mb-2">Start Time</label>
            <input
              type="time"
              id="start_time"
              name="start_time"
              value={bookingDetails.start_time}
              onChange={handleInputChange}
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="end_time" className="block text-gray-300 text-sm font-bold mb-2">End Time</label>
            <input
              type="time"
              id="end_time"
              name="end_time"
              value={bookingDetails.end_time}
              onChange={handleInputChange}
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="number_of_guests" className="block text-gray-300 text-sm font-bold mb-2">Number of Guests</label>
            <input
              type="number"
              id="number_of_guests"
              name="number_of_guests"
              value={bookingDetails.number_of_guests}
              onChange={handleInputChange}
              min="1"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="event_type" className="block text-gray-300 text-sm font-bold mb-2">Type of Event</label>
            <select
              id="event_type"
              name="event_type"
              value={bookingDetails.event_type}
              onChange={handleInputChange}
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            >
              <option>Wedding</option>
              <option>Birthday Party</option>
              <option>Corporate Event</option>
              <option>Workshop</option>
              <option>Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            {isTimeSlotBooked && (
              <p className="text-red-500 text-sm mb-2 font-medium">
                The selected date and time range is already booked or invalid. Please adjust your selection. (Client-side check)
              </p>
            )}
            <button
              type="submit"
              className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full
                ${isBookingLoading || isTimeSlotBooked ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={isBookingLoading || isTimeSlotBooked}
            >
              {isBookingLoading ? 'Submitting...' : isTimeSlotBooked ? 'Time Slot Unavailable' : 'Submit Booking Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventPlaceDetailPage;