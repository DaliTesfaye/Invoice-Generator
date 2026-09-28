import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    const data = await backendRes.json();

    // Clear the jwt cookie on the Next.js origin
    const response = NextResponse.json(data, { status: 200 });
    response.cookies.delete("jwt");

    return response;
  } catch (error) {
    console.error("[/api/auth/logout] Error:", error);
    // Even if the backend fails, clear the cookie on the frontend
    const response = NextResponse.json(
      { success: true, message: "Logged out." },
      { status: 200 }
    );
    response.cookies.delete("jwt");
    return response;
  }
}
