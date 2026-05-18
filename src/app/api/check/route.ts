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
        const fetchOptions: RequestInit = {
          method: endpoint.method,
          signal: AbortSignal.timeout(10000),
        };

        if (endpoint.headers) {
          fetchOptions.headers = JSON.parse(endpoint.headers);
        }

        if (endpoint.body && endpoint.method !== "GET") {
          fetchOptions.body = endpoint.body;
          const headers = fetchOptions.headers as Record<string, string> || {};
          if (!headers["Content-Type"] && !headers["content-type"]) {
            fetchOptions.headers = { ...headers, "Content-Type": "application/json" };
          }
        }

        const response = await fetch(endpoint.url, fetchOptions);
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

      return { endpoint: endpoint.name, ...check };
    })
  );

  return NextResponse.json(results);
}
