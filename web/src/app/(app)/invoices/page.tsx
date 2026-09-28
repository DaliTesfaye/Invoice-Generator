"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  FileText,
  Trash2,
  Eye,
  Loader2,
  Receipt,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

type Invoice = {
  id: string;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  total: number;
  currency: string;
  client: {
    id: string;
    name: string;
    email: string | null;
  };
  _count: {
    items: number;
  };
};

const statusStyles: Record<string, { badge: string; dot: string }> = {
  DRAFT: {
    badge: "bg-slate-100 text-slate-700 border-slate-200/80 hover:bg-slate-100",
    dot: "bg-slate-400",
  },
  SENT: {
    badge: "bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-50",
    dot: "bg-blue-500",
  },
  PAID: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-50",
    dot: "bg-emerald-500",
  },
  OVERDUE: {
    badge: "bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-50",
    dot: "bg-rose-500",
  },
  CANCELLED: {
    badge: "bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-50",
    dot: "bg-amber-500",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      if (data.success) {
        setInvoices(data.invoices);
      }
    } catch (err) {
      console.error("Failed to fetch invoices", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchInvoices();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleDownload = async (id: string, invoiceNumber: string) => {
    try {
      const res = await fetch(`/api/invoices/${id}/pdf`);
      if (!res.ok) throw new Error("Failed to generate PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            Invoices
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Create, track, and manage all your client billing and payments.
          </p>
        </div>
        <Button className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm gap-2 shrink-0">
          <Link href="/invoices/new">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Invoice
          </Link>
        </Button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by invoice # or client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600 shadow-sm"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500 self-end sm:self-center">
          Showing {filteredInvoices.length} {filteredInvoices.length === 1 ? "invoice" : "invoices"}
        </div>
      </div>

      {/* Main Table Section */}
      {isLoading ? (
        <div className="min-h-[40vh] w-full flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium">Loading invoices...</p>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <Card className="border-slate-200 bg-white shadow-sm rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
            <Receipt className="w-7 h-7" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-900 mb-1">
            {searchQuery ? "No invoices found" : "No invoices created yet"}
          </CardTitle>
          <CardDescription className="text-slate-500 max-w-sm mb-6">
            {searchQuery
              ? "No invoices match your current search terms. Try searching for something else."
              : "Start billing your clients by issuing your first professional invoice."}
          </CardDescription>
          {!searchQuery && (
            <Button className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm gap-2">
              <Link href="/invoices/new">
                <Plus className="w-4 h-4" />
                Create your first invoice
              </Link>
            </Button>
          )}
        </Card>
      ) : (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">

          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-[1.2fr_1.5fr_120px_130px_130px_130px_80px] gap-4 px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span>Invoice Ref</span>
            <span>Client</span>
            <span>Status</span>
            <span>Issue Date</span>
            <span>Due Date</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Table Body / Rows */}
          <div className="divide-y divide-slate-100">
            {filteredInvoices.map((invoice) => {
              const status = statusStyles[invoice.status] || statusStyles.DRAFT;

              return (
                <div
                  key={invoice.id}
                  className="grid grid-cols-1 md:grid-cols-[1.2fr_1.5fr_120px_130px_130px_130px_80px] gap-2 md:gap-4 px-6 py-4 items-center hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Invoice # */}
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors hidden md:block">
                      <FileText className="w-4 h-4" />
                    </div>
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      {invoice.invoiceNumber}
                    </Link>
                  </div>

                  {/* Client Info */}
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800 text-sm truncate">
                      {invoice.client.name}
                    </div>
                    {invoice.client.email && (
                      <div className="text-xs text-slate-400 truncate">
                        {invoice.client.email}
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div>
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border gap-1.5 inline-flex items-center capitalize ${status.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {invoice.status.toLowerCase()}
                    </Badge>
                  </div>

                  {/* Issue Date */}
                  <div className="text-xs font-medium text-slate-600">
                    <span className="md:hidden text-slate-400 text-[11px] block">Issued:</span>
                    {formatDate(invoice.issueDate)}
                  </div>

                  {/* Due Date */}
                  <div className="text-xs font-medium text-slate-600">
                    <span className="md:hidden text-slate-400 text-[11px] block">Due:</span>
                    {formatDate(invoice.dueDate)}
                  </div>

                  {/* Total Amount */}
                  <div className="text-sm font-bold text-slate-900 md:text-right">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center md:justify-end gap-1 pt-2 md:pt-0 border-t md:border-0 border-slate-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                      title="View Invoice"
                    >
                      <Link href={`/invoices/${invoice.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-500 hover:text-green-600 hover:bg-green-50"
                      onClick={() => handleDownload(invoice.id, invoice.invoiceNumber)}
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(invoice.id)}
                      title="Delete Invoice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}