"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitDailyCheckIn } from "../actions/userData";
import ImageUpload from "./ImageUpload";

export function DailyCheckInForm({ userId }: { userId: string }) {
  const [checkIn, setCheckIn] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitDailyCheckIn(userId, checkIn);
    setMessage(result.message);
    if (result.success) {
      setCheckIn("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <div className="flex justify-between text-6xl">
        <div className="">😩</div>
        <div>😥</div>
        <div>🙁</div>
        <div>🙂</div>
        <div>😃</div>
        <div>😍</div>
      </div>
      <ImageUpload />
      <Textarea
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        placeholder="Enter your daily check-in"
        required
        className="mb-4"
      />
      <Button type="submit">Submit Check-in</Button>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </form>
  );
}
