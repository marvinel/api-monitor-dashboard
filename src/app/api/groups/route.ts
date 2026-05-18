import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/groups — Returns all unique group names
export async function GET() {
  const endpoints = await prisma.endpoint.findMany({
    select: { group: true },
    distinct: ["group"],
    orderBy: { group: "asc" },
  });

  const groups = endpoints.map((e) => e.group);
  return NextResponse.json(groups);
}
