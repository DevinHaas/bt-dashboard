"use server";

import axios from "axios";

export async function addToWaitingList(email: string) {
  if (!process.env.CLERK_SECRET_KEY) {
    console.error("CLERK_SECRET_KEY is missing");
    return { success: false, message: "Server misconfiguration" };
  }

  try {
    console.log(`Adding email to waitlist: ${email}`);

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

    console.log("Success:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);
      return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || "API request failed",
      };
    }

    console.error("Unexpected Error:", error);
    return { success: false, status: 500, message: "Internal server error" };
  }
}
