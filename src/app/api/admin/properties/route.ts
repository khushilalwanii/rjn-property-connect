import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      propertyCode: true,
      title: true,
      location: true,
      purpose: true,
      verified: true,
    },
  });

  return NextResponse.json(properties);
}
