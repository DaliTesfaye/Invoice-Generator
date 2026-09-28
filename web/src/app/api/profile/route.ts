import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/profile`, {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("[/api/profile GET] Error:", error);
    return NextResponse.json(
      { success: false, message: "Cannot connect to server." },
      { status: 503 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const backendRes = await fetch(`${BACKEND_URL}/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("[/api/profile PUT] Error:", error);
    return NextResponse.json(
      { success: false, message: "Cannot connect to server." },
      { status: 503 }
    );
  }
}
