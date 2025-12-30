import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function generatePropertyCode(purpose: string) {
  const prefix = purpose === "RENT" ? "R" : "S";

  const count = await prisma.property.count({
    where: { purpose },
  });

  const nextNumber = String(count + 1).padStart(4, "0");

  return `${prefix}-RJN-${nextNumber}`;
}


/* GET: Fetch all properties */
export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: [
        { verified: "desc" },   // ✅ verified first
        { createdAt: "desc" },  // newest within group
      ],
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
      contactName,
      contactPhone,
      userId,
    } = body;

    
    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const propertyCode = await generatePropertyCode(purpose);

    const property = await prisma.property.create({
      data: {
        propertyCode,
        title,
        price,
        location,
        purpose,
        identity,
        description,
        images,
        contactName,
        contactPhone,
        userId,
        verified: false,
      },
    });

    if (!/^\d{10}$/.test(contactPhone)) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }


    return NextResponse.json(property, {
      status: 201,
    });
  } catch (error) {
    console.error("PROPERTY CREATE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
