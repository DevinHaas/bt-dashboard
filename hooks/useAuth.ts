import { UserType } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useIsAdmin() {
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const response = await axios.get<UserType>("/api/auth/admin");
      return response.data == UserType.ADMIN;
    },
  });
}
