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
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileWithPreview } from "@/types/screenshotTypes";
import { log } from "console";

const FormSchema: z.ZodType<{ date: Date; screenshots: FileWithPreview[] }> =
  z.object({
    date: z.date({
      required_error: "A date is required",
    }),
    screenshots: z
      .array(
        z.object({
          name: z.string(),
          size: z.number().max(5 * 1024 * 1024, "Each file must be under 5MB"),
          type: z
            .string()
            .regex(/^image\/(jpeg|png|gif)$/, "Only images are allowed"),
          preview: z.string(),
        }),
      )
      .nonempty("At least one image must be uploaded."),
  });

export function ScreenshotForm() {
  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    if (data.date) {
      toast.success("You submitted the following values:");
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
                      date > new Date() || date < new Date("1900-01-01")
                    }
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
        <Button type="submit">Submit Screenshot</Button>
      </form>
    </Form>
  );
}
