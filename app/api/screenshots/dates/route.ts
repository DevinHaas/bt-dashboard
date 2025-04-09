"use server";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

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
    const { userId, redirectToSignIn } = await auth();

    if (!userId) return redirectToSignIn();

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
