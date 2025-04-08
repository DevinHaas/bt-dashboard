"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const dates = await prisma.screenshotUpload.findMany({
    where: {
      userId: userId!,
    },
    select: {
      date: true,
    },
  });

  const datesArray: Date[] = dates.map((date) => date.date);
  return NextResponse.json({
    datesArray: datesArray,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newDate = await prisma.screenshotUpload.create({
      data: {
        date: body.date,
        userId: body.userId,
      },
    });

    return NextResponse.json(newDate, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not add Date", status: 500 });
  }
}
