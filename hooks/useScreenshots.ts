import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useScreenshots() {
  const UploadScreenshots = async (data: FormData) => {
    const request = await axios.post("/api/screenshots", data);
    return request.status;
  };

  const GetUploadDates = (userId: string | undefined) =>
    useQuery<Date[]>({
      queryKey: ["screenshot-dates", userId],
      queryFn: async () => {
        const request = await axios.get(`/api/screenshots/dates`, {
          params: {
            userId: userId,
          },
        });

        return request.data.dates;
      },
      enabled: !!userId,
    });

  return {
    UploadScreenshots,
    GetUploadDates,
  };
}
