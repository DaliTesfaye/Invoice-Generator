import prisma from "../config/db";

export const generateInvoicePdf = async (invoiceId: string, userId: string): Promise<Buffer> => {
  const { default: puppeteer } = await import("puppeteer");
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, userId },
    include: {
      client: true,
      items: true,
      user: {
        include: {
          businessProfile: true,
        },
      },
    },
  });

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  const business = invoice.user.businessProfile ?? {
    name: null,
    email: null,
    phone: null,
    website: null,
    address: null,
    city: null,
    country: null,
    logoUrl: null,
  };
  const client = invoice.client;

  const fmtCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: invoice.currency || "USD",
    }).format(amount);

  const fmtDate = (d: Date | string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const statusColor: Record<string, string> = {
    DRAFT: "#6b7280",
    SENT: "#3b82f6",
    PAID: "#22c55e",
    OVERDUE: "#ef4444",
    CANCELLED: "#eab308",
  };

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: 'Inter', sans-serif; font-size: 11px; line-height: 1.5; color: #111827; }
        .page { padding: 40px; background: white; }
      </style>
    </head>
    <body class="page">
      <!-- Header -->
      <div class="flex justify-between items-start mb-10">
        <div class="flex items-start gap-4">
          ${
            business.logoUrl
              ? `<img src="${business.logoUrl}" alt="Logo" class="w-16 h-16 object-contain rounded" />`
              : `<div class="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xl font-bold">${
                  (business.name || "?")[0]
                }</div>`
          }
          <div>
            <h2 class="text-lg font-bold text-gray-900">${business.name || "Your Business"}</h2>
            ${business.email ? `<p class="text-gray-500">${business.email}</p>` : ""}
            ${business.phone ? `<p class="text-gray-500">${business.phone}</p>` : ""}
          </div>
        </div>
        <div class="text-right">
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">INVOICE</h1>
          <span
            class="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase text-white"
            style="background-color: ${statusColor[invoice.status] || "#6b7280"}"
          >
            ${invoice.status}
          </span>
        </div>
      </div>

      <!-- Invoice meta + addresses -->
      <div class="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">From</p>
          <p class="font-medium text-sm">${business.name || "—"}</p>
          ${business.address ? `<p class="text-gray-600">${business.address}</p>` : ""}
          ${
            business.city || business.country
              ? `<p class="text-gray-600">${[business.city, business.country].filter(Boolean).join(", ")}</p>`
              : ""
          }
          ${business.website ? `<p class="text-gray-500 mt-1">${business.website}</p>` : ""}
        </div>
        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Bill To</p>
          <p class="font-medium text-sm">${client.name}</p>
          ${client.email ? `<p class="text-gray-600">${client.email}</p>` : ""}
          ${client.address ? `<p class="text-gray-600">${client.address}</p>` : ""}
          ${
            client.city || client.country
              ? `<p class="text-gray-600">${[client.city, client.country].filter(Boolean).join(", ")}</p>`
              : ""
          }
        </div>
      </div>

      <!-- Invoice details bar -->
      <div class="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg px-6 py-4 mb-8">
        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Invoice #</p>
          <p class="font-semibold text-gray-900 text-sm">${invoice.invoiceNumber}</p>
        </div>
        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Issue Date</p>
          <p class="text-gray-700 text-sm">${fmtDate(invoice.issueDate)}</p>
        </div>
        <div>
          <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Due Date</p>
          <p class="text-gray-700 text-sm">${fmtDate(invoice.dueDate)}</p>
        </div>
      </div>

      <!-- Line items table -->
      <div class="mb-8">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-gray-200">
              <th class="text-left py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Description</th>
              <th class="text-right py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-20">Qty</th>
              <th class="text-right py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-24">Rate</th>
              <th class="text-right py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items
              .map(
                (item) => `
              <tr class="border-b border-gray-100">
                <td class="py-3 text-gray-800 text-sm">${item.description}</td>
                <td class="py-3 text-right text-gray-600 text-sm">${item.quantity}</td>
                <td class="py-3 text-right text-gray-600 text-sm">${fmtCurrency(item.rate)}</td>
                <td class="py-3 text-right font-medium text-gray-900 text-sm">${fmtCurrency(item.amount)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div class="flex justify-end mb-10">
        <div class="w-64 space-y-2">
          <div class="flex justify-between text-gray-600 text-sm">
            <span>Subtotal</span>
            <span>${fmtCurrency(invoice.subtotal)}</span>
          </div>
          ${
            invoice.taxRate > 0
              ? `
          <div class="flex justify-between text-gray-600 text-sm">
            <span>Tax (${invoice.taxRate}%)</span>
            <span>${fmtCurrency(invoice.taxAmount)}</span>
          </div>
          `
              : ""
          }
          <div class="flex justify-between pt-3 border-t-2 border-gray-900 text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>${fmtCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      ${
        invoice.notes
          ? `
      <div>
        <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
        <p class="text-gray-600 text-sm whitespace-pre-wrap">${invoice.notes}</p>
      </div>
      `
          : ""
      }
    </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
  });

  await browser.close();

  return Buffer.from(pdfBuffer);
};
