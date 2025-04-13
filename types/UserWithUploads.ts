export type UserWithUploads = {
  userId: string;
  lastUpload: Date | null;
  uploadCount: number;
  screenshotUploads: {
    userId: string;
    date: Date;
  }[];
};
