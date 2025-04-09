import { UserType } from "@/types/userType";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useIsAdmin() {
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const response = await axios.get<{ role: string }>("/api/auth/admin");

      const role: UserType = response.data.role as UserType;
      return role === UserType.ADMIN;
    },
  });
}
