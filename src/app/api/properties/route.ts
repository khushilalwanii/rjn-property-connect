import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* GET: Fetch all properties */
export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

/* POST: Add new property */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      price,
      location,
      purpose,
      identity,
      description,
      images,
    } = body;

    const property = await prisma.property.create({
      data: {
        title,
        price,
        location,
        purpose,
        identity,
        description,
        images,
        verified: false,
      },
    });

    return NextResponse.json(property, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
