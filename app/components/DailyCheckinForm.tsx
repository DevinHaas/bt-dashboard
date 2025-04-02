"use client";

import { Button } from "@/components/ui/button";
import ImageUpload from "./ImageUpload";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, isSameDay } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileWithPreview } from "@/types/screenshotTypes";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { STUDY_START_DATE } from "@/lib/study_meta";
import {
  useGetUploadDates,
  useUploadScreenshots,
} from "@/hooks/useScreenshots";

const FormSchema: z.ZodType<{ date: Date; screenshots: FileWithPreview[] }> =
  z.object({
    date: z.date({
      required_error: "A date is required",
    }),
    screenshots: z
      .array(
        z.object({
          file: z.instanceof(File),
          preview: z.string(),
        }),
      )
      .nonempty("At least one image must be uploaded."),
  });

export function ScreenshotForm() {
  const { userId } = useAuth();

  const { mutate: UploadScreenshots } = useUploadScreenshots();
  const { data: dates } = useGetUploadDates(userId);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();

    formData.append("userId", userId!);
    formData.append("date", data.date.toDateString());
    data.screenshots.forEach((file) => {
      formData.append("screenshots", file.file);
    });

    try {
      if (!userId) {
        throw new Error("please log-in to upload screenshots");
      }

      UploadScreenshots({ data: formData, date: data.date, userId });

      toast.success(
        `Your ${
          data.screenshots.length > 1 ? "screenshots were" : "screenshot was"
        } successfully uploaded 🎉`,
      );
      form.reset();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Upload failed. Please try again.";

        toast.error(message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Screenshots</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date: Date) =>
                      date > new Date() || date < STUDY_START_DATE
                    }
                    modifiers={{
                      uploaded: (date: Date) => {
                        console.log(dates);
                        return (
                          dates?.some((d: Date) => isSameDay(d, date)) ?? false
                        );
                      },
                    }}
                    modifiersClassNames={{
                      uploaded: "bg-green-200 text-green-800",
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The date is used to determine from which time the screenshots
                are which you provided
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImageUpload control={form.control} />
        <Button className="mt-2" type="submit">
          Submit Screenshot
        </Button>
      </form>
    </Form>
  );
}
