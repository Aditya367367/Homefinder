import { useQuery } from "@tanstack/react-query";
import api from '../../utils/axiosInstance';
import { toast } from "react-toastify";

const fetchUserEventPlacesAPI = async () => {
    const response = await api.get('auth/user/my-listings/');
    return response.data;
};

export const useFetchUserProperties = () => {
    return useQuery({
        queryKey: ["userEventPlacesData"],
        queryFn: fetchUserEventPlacesAPI,
        onError: (error) => {
            console.error("Failed to fetch user event places:", error);
            toast.error('Failed to load your event spaces. Please try again.');
        },
    });
};