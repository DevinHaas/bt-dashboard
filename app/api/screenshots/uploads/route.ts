"use server";
import { UserWithUploads } from "@/lib/api";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        screenshotUploads: true,
      },
    });

    const transformedData: UserWithUploads[] = users.map((user) => ({
      userId: user.clerk_id,
      lastUpload:
        user.screenshotUploads.length > 0
          ? new Date(
              Math.max(
                ...user.screenshotUploads.map((upload) =>
                  upload.date.getTime(),
                ),
              ),
            )
          : null,
      uploadCount: user.screenshotUploads.length,
      screenshotUploads: user.screenshotUploads.map((upload) => ({
        userId: upload.userId,
        date: upload.date,
      })),
    }));

    return NextResponse.json(transformedData, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: `Could not get upload data ${error}`,
      status: 500,
    });
  }
}
