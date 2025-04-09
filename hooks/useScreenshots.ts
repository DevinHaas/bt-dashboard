import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useUploadScreenshots() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["screenshots"],
    mutationFn: async ({ data, date }: { data: FormData; date: Date }) => {
      try {
        await axios.post("/api/screenshots/dates", { date });

        const request = await axios.post("/api/screenshots", data);
        return request.status;
      } catch (error: unknown) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["screenshot-dates"],
      });
    },
  });
}

export function useGetUploadDates() {
  return useQuery<Date[]>({
    queryKey: ["screenshot-dates"],
    queryFn: async () => {
      const request = await axios.get(`/api/screenshots/dates`);

      return request.data.datesArray;
    },
  });
}
