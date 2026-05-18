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
