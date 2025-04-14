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
    const { userId } = await auth();

    if (!userId) throw Error("userId not found");

    const body = await request.json();
    if (!body.date) throw Error("please provide a date");

    const newDate = await prisma.screenshotUpload.create({
      data: {
        date: body.date,
        userId: userId,
      },
    });

    return NextResponse.json(newDate, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not add Date", status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateId = searchParams.get("dateId");

    if (!dateId) {
      return NextResponse.json(
        { error: "DateId is required" },
        { status: 400 },
      );
    }

    const dateEntry = await prisma.screenshotUpload.findUnique({
      where: { id: dateId },
    });

    if (!dateEntry) {
      return NextResponse.json(
        { error: "Screenshot upload not found" },
        { status: 404 },
      );
    }

    await prisma.screenshotUpload.delete({
      where: { id: dateId },
    });

    return NextResponse.json(
      { message: "Screenshot upload deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
