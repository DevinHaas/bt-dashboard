"use server";
import prisma from "@/lib/prisma";
import { UserWithUploads } from "@/types/UserWithUploads";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

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
