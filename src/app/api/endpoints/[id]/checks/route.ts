import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/endpoints/:id/checks — Get endpoint details with full check history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const endpoint = await prisma.endpoint.findUnique({
    where: { id },
    include: {
      checks: {
        orderBy: { checkedAt: "desc" },
        take: 100, // Last 100 checks for detailed view
      },
    },
  });

  if (!endpoint) {
    return NextResponse.json({ error: "Endpoint not found" }, { status: 404 });
  }

  // Calculate stats
  const totalChecks = endpoint.checks.length;
  const upChecks = endpoint.checks.filter((c) => c.isUp).length;
  const uptimePercentage = totalChecks > 0 ? (upChecks / totalChecks) * 100 : 0;
  const avgLatency =
    totalChecks > 0
      ? Math.round(
          endpoint.checks.reduce((sum, c) => sum + c.latency, 0) / totalChecks
        )
      : 0;

  return NextResponse.json({
    ...endpoint,
    stats: {
      totalChecks,
      upChecks,
      uptimePercentage: Math.round(uptimePercentage * 10) / 10,
      avgLatency,
    },
  });
}
