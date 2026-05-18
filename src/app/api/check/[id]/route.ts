import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/check/:id — Ping a single endpoint and save the result
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const endpoint = await prisma.endpoint.findUnique({
    where: { id },
  });

  if (!endpoint) {
    return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
  }

  const start = Date.now();
  let status = 0;
  let isUp = false;

  try {
    const response = await fetch(endpoint.url, {
      method: "GET",
      signal: AbortSignal.timeout(10000),
    });
    status = response.status;
    isUp = status >= 200 && status < 300;
  } catch {
    status = 0;
    isUp = false;
  }

  const latency = Date.now() - start;

  const check = await prisma.check.create({
    data: {
      status,
      latency,
      isUp,
      endpointId: endpoint.id,
    },
  });

  return NextResponse.json(check);
}
