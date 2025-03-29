import { ScreenshotUploadTypes as ScreenshotUploadType } from "@/types/screenshotUploadTypes";
import axios from "axios";

export default function useMinioClient() {
  const uploadScreenshots = async (data: ScreenshotUploadType) => {
    const request = await axios.post("api/screenshots", data);
    return request.status;
  };

  return {
    uploadScreenshots,
  };
}
