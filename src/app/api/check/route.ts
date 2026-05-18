import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/check — Ping all registered endpoints and save results
export async function POST() {
  const endpoints = await prisma.endpoint.findMany();

  const results = await Promise.all(
    endpoints.map(async (endpoint) => {
      const start = Date.now();
      let status = 0;
      let isUp = false;

      try {
        const response = await fetch(endpoint.url, {
          method: "GET",
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });
        status = response.status;
        isUp = status >= 200 && status < 300;
      } catch {
        // If fetch fails (timeout, DNS error, etc.), status stays 0
        status = 0;
        isUp = false;
      }

      const latency = Date.now() - start;

      // Save the check result to the database
      const check = await prisma.check.create({
        data: {
          status,
          latency,
          isUp,
          endpointId: endpoint.id,
        },
      });

      return { endpoint: endpoint.name, ...check };
    })
  );

  return NextResponse.json(results);
}
