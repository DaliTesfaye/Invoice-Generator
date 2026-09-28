"use client";

import Image from "next/image";

type PreviewItem = {
  description: string;
  quantity: string;
  rate: string;
};

type BusinessInfo = {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
};

type ClientInfo = {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
};

interface InvoicePreviewProps {
  business: BusinessInfo;
  client: ClientInfo | null;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  taxRate: string;
  notes: string;
  items: PreviewItem[];
  status?: string;
}

export function InvoicePreview({
  business,
  client,
  invoiceNumber,
  issueDate,
  dueDate,
  currency,
  taxRate,
  notes,
  items,
  status,
}: InvoicePreviewProps) {
  const getLineTotal = (item: PreviewItem) =>
    (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);

  const subtotal = items.reduce((sum, item) => sum + getLineTotal(item), 0);
  const taxAmt = subtotal * ((parseFloat(taxRate) || 0) / 100);
  const total = subtotal + taxAmt;

  const fmt = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);

  const fmtDate = (d: string) => {
    if (!d) return "—";
    return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
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

  return (
    <div
      className="bg-white text-gray-900 rounded-lg shadow-lg border"
      style={{ fontSize: "11px", lineHeight: "1.5" }}
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-6 flex justify-between items-start">
        <div className="flex items-start gap-4">
          {business.logoUrl ? (
            <Image
              src={business.logoUrl}
              alt="Logo"
              width={48}
              height={48}
              unoptimized
              className="w-12 h-12 object-contain rounded"
            />
          ) : (
            <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-bold">
              {(business.name || "?")[0]}
            </div>
          )}
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {business.name || "Your Business"}
            </h2>
            {business.email && (
              <p className="text-gray-500">{business.email}</p>
            )}
            {business.phone && (
              <p className="text-gray-500">{business.phone}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            INVOICE
          </h1>
          {status && (
            <span
              className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase text-white"
              style={{ backgroundColor: statusColor[status] || "#6b7280" }}
            >
              {status}
            </span>
          )}
        </div>
      </div>

      {/* Invoice meta + addresses */}
      <div className="px-8 pb-6 grid grid-cols-2 gap-6">
        {/* From */}
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            From
          </p>
          <p className="font-medium">{business.name || "—"}</p>
          {business.address && <p className="text-gray-600">{business.address}</p>}
          {(business.city || business.country) && (
            <p className="text-gray-600">
              {[business.city, business.country].filter(Boolean).join(", ")}
            </p>
          )}
          {business.website && (
            <p className="text-gray-500">{business.website}</p>
          )}
        </div>

        {/* To */}
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Bill To
          </p>
          {client ? (
            <>
              <p className="font-medium">{client.name}</p>
              {client.email && <p className="text-gray-600">{client.email}</p>}
              {client.address && (
                <p className="text-gray-600">{client.address}</p>
              )}
              {(client.city || client.country) && (
                <p className="text-gray-600">
                  {[client.city, client.country].filter(Boolean).join(", ")}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-400 italic">No client selected</p>
          )}
        </div>
      </div>

      {/* Invoice details bar */}
      <div className="mx-8 mb-6 grid grid-cols-3 gap-4 bg-gray-50 rounded-lg px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Invoice #
          </p>
          <p className="font-semibold text-gray-900">
            {invoiceNumber || "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Issue Date
          </p>
          <p className="text-gray-700">{fmtDate(issueDate)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Due Date
          </p>
          <p className="text-gray-700">{fmtDate(dueDate)}</p>
        </div>
      </div>

      {/* Line items table */}
      <div className="px-8 pb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="text-right py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-16">
                Qty
              </th>
              <th className="text-right py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-20">
                Rate
              </th>
              <th className="text-right py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-24">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.filter((i) => i.description.trim()).length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-gray-400 italic"
                >
                  No items added yet
                </td>
              </tr>
            ) : (
              items
                .filter((i) => i.description.trim())
                .map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-2 text-gray-800">{item.description}</td>
                    <td className="py-2 text-right text-gray-600">
                      {item.quantity || 0}
                    </td>
                    <td className="py-2 text-right text-gray-600">
                      {fmt(parseFloat(item.rate) || 0)}
                    </td>
                    <td className="py-2 text-right font-medium text-gray-900">
                      {fmt(getLineTotal(item))}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="px-8 pb-6 flex justify-end">
        <div className="w-56 space-y-1">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>
          {parseFloat(taxRate) > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Tax ({taxRate}%)</span>
              <span>{fmt(taxAmt)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t-2 border-gray-900 text-sm font-bold text-gray-900">
            <span>Total</span>
            <span>{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="px-8 pb-8">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Notes
          </p>
          <p className="text-gray-600 whitespace-pre-wrap">{notes}</p>
        </div>
      )}
    </div>
  );
}
