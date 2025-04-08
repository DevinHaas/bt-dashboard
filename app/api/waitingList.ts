"use server";

import axios from "axios";

export async function addToWaitingList(email: string) {
  if (!process.env.CLERK_SECRET_KEY) {
    return { success: false, message: "Server misconfiguration" };
  }

  try {
    const response = await axios.post(
      "https://api.clerk.com/v1/waitlist_entries",
      {
        email_address: email,
        notify: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      },
    );

    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || "API request failed",
      };
    }

    return { success: false, status: 500, message: "Internal server error" };
  }
}
