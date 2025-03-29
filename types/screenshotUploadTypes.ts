import { FileWithPreview } from "./screenshotTypes";

export interface ScreenshotUploadTypes {
  date: Date;
  userId: string;
  screenshots: FileWithPreview[];
}
