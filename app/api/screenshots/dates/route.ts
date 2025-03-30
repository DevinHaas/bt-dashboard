"use server";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log(searchParams.get("userId"));

  return NextResponse.json({
    dates: [new Date("2025-03-04"), new Date("2025-03-13")],
  });
}
