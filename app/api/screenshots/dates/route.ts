"use server";

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  console.log("request called");

  const dates = await prisma.screenshotUpload.findMany({
    where: {
      userId: userId!,
    },
    select: {
      date: true,
    },
  });
  console.log(dates);

  const datesArray: Date[] = dates.map((date) => date.date);
  console.log("Dates array", datesArray);
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
