"use server";

import prisma from "@/lib/prisma";
import { UserType } from "@/types/userType";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
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

    if (user?.role == UserType.USER) {
      return NextResponse.json("You are not authoriced", { status: 401 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error, status: 500 });
  }
}
