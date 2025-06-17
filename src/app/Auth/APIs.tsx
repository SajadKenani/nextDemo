import { useCallback } from "react";
import { GET } from "./Requests";

const useFetchHandlers = () => {

  const HandleDataFetching = useCallback(
    async (setData: React.Dispatch<React.SetStateAction<unknown[]>>) => {
      try {
        const response = await GET(`trpc/management.marketplaceAnalytics`); // or POST if needed
        console.log("Announcements fetched:", response);
        setData(response as unknown[]);
        return response || [];
      } catch (err) {
        console.error("Announcements fetch error:", err);
        throw err; // Re-throw so the caller can handle the error
      }
    }, []);

  return {
    HandleDataFetching,
  };
};

export default useFetchHandlers;