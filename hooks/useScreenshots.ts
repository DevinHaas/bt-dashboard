import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useScreenshots() {
  const UploadScreenshots = async (data: FormData) => {
    const request = await axios.post("/api/screenshots", data);
    return request.status;
  };

  const GetUploadDates = (userId: string) =>
    useQuery<Date[]>({
      queryKey: ["screenshot-dates", userId],
      queryFn: async () => {
        const request = await axios.get(`/api/screenshots/dates`, {
          params: {
            userId: userId,
          },
        });

        console.log(request.data.dates);
        return request.data.dates;
      },
      enabled: !!userId,
    });

  return {
    UploadScreenshots,
    GetUploadDates,
  };
}
