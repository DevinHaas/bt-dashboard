"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("Request recieve");

  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();

  try {
    const user = await prisma.user.findUnique({
      where: {
        clerk_id: userId,
      },
      select: {
        role: true,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error, status: 500 });
  }
}
