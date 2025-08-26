import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axiosInstance";

const fetchUserPropertiesAPI = async () => {
    const response = await api.get("/auth/property/mine/");
    return response.data;
};

export const useFetchUserPropertiess = () => {
    const { data, isLoading, isError, error, isSuccess, refetch } = useQuery({
        queryKey: ["userPropertiesData"],
        queryFn: fetchUserPropertiesAPI,
        staleTime: 5 * 60 * 1000,
    });

    return {
        userProperties: data,
        isLoadingUserProperties: isLoading,
        isErrorUserProperties: isError,
        errorUserProperties: error,
        isSuccessUserProperties: isSuccess,
        refetchUserProperties: refetch,
    };
};
