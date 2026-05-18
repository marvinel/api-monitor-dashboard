import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/endpoints/:id — Remove an endpoint and all its checks
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.endpoint.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

// PUT /api/endpoints/:id — Update an endpoint's configuration
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();
  const { name, url, method, headers, requestBody } = data;

  const endpoint = await prisma.endpoint.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(url && { url }),
      ...(method && { method }),
      headers: headers ?? undefined,
      body: requestBody ?? undefined,
    },
  });

  return NextResponse.json(endpoint);
}
