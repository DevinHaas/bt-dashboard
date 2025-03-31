import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useUploadScreenshots() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["screenshots"],
    mutationFn: async ({
      data,
      date,
      userId,
    }: {
      data: FormData;
      date: Date;
      userId: string;
    }) => {
      try {
        await axios.post("/api/screenshots/dates", { date, userId });

        const request = await axios.post("/api/screenshots", data);
        return request.status;
      } catch (error: unknown) {
        throw error;
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: ["screenshot-dates", userId],
      });
    },
  });
}

export function useGetUploadDates(userId?: string | null) {
  return useQuery<Date[]>({
    queryKey: ["screenshot-dates", userId],
    queryFn: async () => {
      const request = await axios.get(`/api/screenshots/dates`, {
        params: {
          userId: userId,
        },
      });

      return request.data.datesArray;
    },
    enabled: !!userId,
  });
}
