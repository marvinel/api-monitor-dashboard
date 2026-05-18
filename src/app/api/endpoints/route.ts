import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/endpoints — Returns all endpoints with their latest checks
export async function GET() {
  const endpoints = await prisma.endpoint.findMany({
    include: {
      checks: {
        orderBy: { checkedAt: "desc" },
        take: 50,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(endpoints);
}

// POST /api/endpoints — Add a new endpoint to monitor
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, url, method, headers, requestBody } = body;

  if (!name || !url) {
    return NextResponse.json(
      { error: "Name and URL are required" },
      { status: 400 }
    );
  }

  const endpoint = await prisma.endpoint.create({
    data: {
      name,
      url,
      method: method || "GET",
      headers: headers || null,
      body: requestBody || null,
    },
  });

  return NextResponse.json(endpoint, { status: 201 });
}
