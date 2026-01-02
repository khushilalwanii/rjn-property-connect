import { generatePropertyCode } from "@/lib/generatePropertyCode";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ✅ Validate incoming data
const schema = z.object({
  title: z.string().min(3),
  price: z.number(),
  location: z.string(),
  purpose: z.string(),
  identity: z.string(),
  description: z.string(),
  images: z.array(z.string()),
  contactName: z.string(),
  contactPhone: z.string(),
  userEmail: z.string().email(), // ✅ THIS WAS MISSING
});

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    console.error("GET PROPERTIES ERROR:", error);

    // Always return JSON
    return NextResponse.json(
      { error: "Failed to load properties" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    // ✅ STEP 1: read & validate body
    const body = await req.json();
    const {
      title,
      location,
      purpose,
      identity,
      description,
      images,
      contactName,
      contactPhone,
      userEmail, // ✅ NOW DEFINED
    } = schema.parse(body);

    const { price } = schema.parse(body);


    // ✅ STEP 2: fetch Prisma user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    // ✅ STEP 3: create property (retry for unique code)
    let property = null;
    let attempts = 0;

    while (!property && attempts < 2) {
      try {
        const propertyCode = await generatePropertyCode(purpose);

        property = await prisma.property.create({
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
            userId: user.id, // ✅ FK satisfied
            verified: false,
          },
        });
      } catch (err) {
        attempts++;
      }
    }

    if (!property) {
      return NextResponse.json(
        { error: "Failed to generate unique property code" },
        { status: 500 }
      );
    }

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.flatten() },
        { status: 400 }
      );
    }

    console.error("PROPERTY CREATE ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
