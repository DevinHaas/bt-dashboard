import { UserType } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useIsAdmin() {
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      try {
        const response = await axios.get<{ role: string | null }>(
          "/api/auth/admin",
        );

        if (response.data.role == null) {
          return false;
        }
        const role: UserType = response.data.role as UserType;
        return role === UserType.ADMIN;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          return false;
        } else {
          throw error;
        }
      }
    },
  });
}
