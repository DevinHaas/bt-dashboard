"use client";

import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserWithUploads } from "@/types/UserWithUploads";

interface UploadHistoryModalProps {
  userData: UserWithUploads | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadHistoryModal({
  userData,
  open,
  onOpenChange,
}: UploadHistoryModalProps) {
  if (!userData) return null;

  const uploadDates = userData.screenshotUploads.map(
    (upload: { userId: string; date: Date }) => new Date(upload.date),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Upload History for{userData.userId}
          </DialogTitle>
          <DialogDescription>
            Green dates indicate days with uploads. Orange dates indicate days
            without uploads.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center border rounded-md p-4">
          <Calendar
            mode="single"
            selected={undefined}
            modifiers={{
              hasUpload: uploadDates,
            }}
            modifiersClassNames={{
              hasUpload: "bg-green-100 text-green-700 font-medium",
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
              {uploadDates.length} Uploads
            </Badge>
            <span className="text-sm text-muted-foreground">
              Last upload:{" "}
              {userData.lastUpload
                ? format(new Date(userData.lastUpload), "PPP")
                : "Never"}
            </span>
          </div>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
