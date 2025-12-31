import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id, email, name } = await req.json();

    if (!id || !email) {
      return NextResponse.json(
        { error: "Missing user data" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: { 
          email,
          name,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save user error:", error);
    return NextResponse.json(
      { error: "Failed to save user" },
      { status: 500 }
    );
  }
}