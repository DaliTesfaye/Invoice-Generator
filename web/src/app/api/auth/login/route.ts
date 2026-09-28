import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const backendRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    // Extract the jwt cookie set by the backend
    const setCookie = backendRes.headers.get("set-cookie");

    const response = NextResponse.json(data, { status: 200 });

    // Forward the cookie to the browser under the Next.js origin
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error) {
    console.error("[/api/auth/login] Error:", error);
    return NextResponse.json(
      { success: false, message: "Cannot connect to server. Please try again later." },
      { status: 503 }
    );
  }
}
