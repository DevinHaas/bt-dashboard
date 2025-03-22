"use client";

import React, { type ChangeEvent } from "react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { FileWithPreview } from "@/types/screenshotTypes";
import { Control, ControllerRenderProps, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ScreenshotFormValues {
  screenshots: FileWithPreview[];
  date: Date;
}

interface ImageUploadProps {
  control: Control<ScreenshotFormValues>;
}
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export default function FileUploader({ control }: ImageUploadProps) {
  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<ScreenshotFormValues, "screenshots">,
  ) => {
    if (!event.target.files) return;

    const newScreenshots = Array.from(event.target.files)
      .filter((file) => file.size <= MAX_FILE_SIZE)
      .map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file),
      }));

    field.onChange([...(field.value || []), ...newScreenshots]);
  };

  return (
    <FormField
      name="screenshots"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Screenshots</FormLabel>
          <FormControl>
            <div>
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={(e) => handleFileChange(e, field)}
                  accept="image/*"
                />
              </label>
              {field.value?.length > 0 && (
                <div className="mt-2 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {field.value?.map((file, index: number) => (
                      <div key={index} className="relative group">
                        <div
                          className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer z-10"
                          onClick={() => {
                            const newScreenshots = [...field.value];
                            URL.revokeObjectURL(newScreenshots[index].preview!);
                            newScreenshots.splice(index, 1);
                            field.onChange(newScreenshots);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </div>

                        {file.preview ? (
                          <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={file.preview || "/placeholder.svg"}
                              alt={file.name}
                              fill
                              className="rounded-md object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center aspect-square rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-500 truncate max-w-[120px]">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {(file.size / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
