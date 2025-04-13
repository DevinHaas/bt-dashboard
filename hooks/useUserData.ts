import { UserWithUploads } from "@/types/UserWithUploads";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useUserUploadData() {
  return useQuery<UserWithUploads[]>({
    queryKey: ["user-upload-data"],
    queryFn: async () => {
      const response = await axios.get("/api/screenshots/uploads/");

      return response.data;
    },
  });
}
