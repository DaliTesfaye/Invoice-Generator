import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/invoices/${params.id}/pdf`, {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to generate PDF" },
        { status: backendRes.status }
      );
    }

    const pdfBuffer = await backendRes.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${params.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[/api/invoices/:id/pdf GET] Error:", error);
    return NextResponse.json(
      { success: false, message: "Cannot connect to server." },
      { status: 503 }
    );
  }
}
