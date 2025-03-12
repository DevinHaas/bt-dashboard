"use client";

import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { Trash2 } from "lucide-react";

interface FileWithPreview extends File {
  preview?: string;
}

export default function FileUploader() {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).map((file) => {
        // Only create preview for image files
        if (file.type.startsWith("image/")) {
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        }
        return file;
      });
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      // Cleanup preview URL to prevent memory leaks
      if (newFiles[indexToRemove].preview) {
        URL.revokeObjectURL(newFiles[indexToRemove].preview!);
      }
      newFiles.splice(indexToRemove, 1);
      return newFiles;
    });
  };

  // Cleanup preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [selectedFiles]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h5 className="text-md font-bold mb-6">Upload Screenshots 📱</h5>
      <form className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-center w-full">
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
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
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
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Selected Files</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div
                    className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer z-10"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </div>

                  {file.preview ? (
                    <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt={file.name}
                        className="w-full h-full object-cover"
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
      </form>
    </div>
  );
}
