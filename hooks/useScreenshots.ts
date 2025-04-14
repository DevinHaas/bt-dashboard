import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function useUploadScreenshots() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["screenshots"],
    mutationFn: async ({ data, date }: { data: FormData; date: Date }) => {
      let dateId: string | null = null;
      try {
        const response1 = await axios.post("/api/screenshots/dates", { date });

        dateId = response1.data.id;
        if (response1.status !== 201) {
          throw Error("Failed to insert screenshot upload");
        }

        const minioUpload = await axios.post("/api/screenshots", data);

        if (minioUpload.status !== 200) {
          throw new Error("Failed to upload screenshots");
        }

        return minioUpload.data;
      } catch (error) {
        if (dateId && !axios.isAxiosError(error)) {
          await axios.delete(`/api/screenshots/dates?dateId=${dateId}`);
        }

        if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data?.message || "Upload failed");
        }
        throw new Error("An unexpected error occurred during upload");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["screenshot-dates"],
      });
      toast.success("Your screenshots where uploaded😍");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to upload screenshots");
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
