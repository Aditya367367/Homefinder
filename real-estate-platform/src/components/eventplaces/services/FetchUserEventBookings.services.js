import { useQuery } from "@tanstack/react-query";
import api from '../../utils/axiosInstance';
import { toast } from "react-toastify";


const fetchUserEventBookings = async ({ queryKey }) => {
    const [, options] = queryKey;
   
    const { page = 1 } = options || {}; 
    const { data } = await api.get(`/auth/user/my-event-bookings/?page=${page}`); 
    return data;
};

export const useFetchUserEventBookings = (options) => {
    return useQuery({
        queryKey: ["userEventBookings", options],
        queryFn: fetchUserEventBookings,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        onError: (error) => {
            console.error("Failed to fetch user event bookings:", error);
            toast.error("Failed to load your bookings. Please try again.");
        },
    });
};