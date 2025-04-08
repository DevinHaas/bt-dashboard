import { generateMockUsers } from "./mock-data";

export type UserWithUploads = {
  userId: string;
  lastUpload: Date | null;
  uploadCount: number;
  screenshotUploads: {
    userId: string;
    date: Date;
  }[];
};

export async function fetchUserUploads(): Promise<UserWithUploads[]> {
  // For the preview, we'll use mock data
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(generateMockUsers(15));
    }, 500);
  });
}
