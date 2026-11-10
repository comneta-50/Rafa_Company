import { NextRequest, NextResponse } from "next/server";
import { Config } from "@/lib/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, await params, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, await params, "POST");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, await params, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(request, await params, "DELETE");
}

async function handleProxy(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  const targetPath = (params.path || []).join("/");
  const search = request.nextUrl.search;
  const targetUrl = `${Config.workerApiUrl}/api/${targetPath}${search}`;

  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  let body: string | undefined = undefined;
  if (method === "POST" || method === "PATCH" || method === "PUT") {
    try {
      body = await request.text();
    } catch {
      // body empty
    }
  }

  try {
    const res = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to connect to Cloudflare Worker", details: error.message },
      { status: 502 }
    );
  }
}
