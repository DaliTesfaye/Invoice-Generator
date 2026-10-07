"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Loader2,
  FileText,
  User,
  Calendar,
  Receipt,
  AlertCircle,
  Eye,
  Download,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";
import { CURRENCY_OPTIONS, DEFAULT_CURRENCY } from "@/lib/currencies";

import { InvoicePreview } from "@/components/invoice/invoice-preview";

type Client = {
  id: string;
  name: string;
  email: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
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

type LineItem = {
  id?: string;
  description: string;
  quantity: string;
  rate: string;
};

const statuses = ["DRAFT", "SENT", "PAID", "OVERDUE", "CANCELLED"];

// Clean focus styles replacing ugly browser blue rings
const formControlStyles =
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all duration-150 outline-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-xs placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50";

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;

  const [clients, setClients] = useState<Client[]>([]);
  const [businessProfile, setBusinessProfile] = useState<BusinessInfo>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [clientId, setClientId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [taxRate, setTaxRate] = useState("0");
  const [notes, setNotes] = useState("");
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);

  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: "1", rate: "0" },
  ]);

  useEffect(() => {
    const init = async () => {
      try {
        const [clientsRes, invoiceRes, profileRes] = await Promise.all([
          fetch("/api/clients"),
          fetch(`/api/invoices/${invoiceId}`),
          fetch("/api/profile", { cache: "no-store" }),
        ]);
        const clientsData = await clientsRes.json();
        const invoiceData = await invoiceRes.json();
        const profileData = await profileRes.json();

        if (clientsData.success) setClients(clientsData.clients);
        if (profileData.success && profileData.profile)
          setBusinessProfile(profileData.profile);

        if (invoiceData.success && invoiceData.invoice) {
          const inv = invoiceData.invoice;
          setClientId(inv.clientId || "");
          setInvoiceNumber(inv.invoiceNumber || "");
          setStatus(inv.status || "DRAFT");
          setIssueDate(
            inv.issueDate
              ? new Date(inv.issueDate).toISOString().split("T")[0]
              : ""
          );
          setDueDate(
            inv.dueDate
              ? new Date(inv.dueDate).toISOString().split("T")[0]
              : ""
          );
          setTaxRate(String(inv.taxRate || 0));
          setNotes(inv.notes || "");
          setCurrency(inv.currency || "USD");
          if (inv.items && inv.items.length > 0) {
            setItems(
              inv.items.map((item: { id: string; description: string; quantity: number; rate: number }) => ({
                id: item.id,
                description: item.description,
                quantity: String(item.quantity),
                rate: String(item.rate),
              }))
            );
          }
        }
      } catch (err) {
        console.error("Init error:", err);
        setError("Failed to load invoice details.");
      } finally {
        setIsLoading(false);
      }
    };
    if (invoiceId) {
      init();
    }
  }, [invoiceId]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: "1", rate: "0" }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof LineItem, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const getLineTotal = (item: LineItem) => {
    return (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
  };

  const subtotal = items.reduce((sum, item) => sum + getLineTotal(item), 0);
  const taxAmount = subtotal * ((parseFloat(taxRate) || 0) / 100);
  const total = subtotal + taxAmount;

  const formatMoney = (amount: number) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
      }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(2)}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    if (!clientId) {
      setError("Please select a client");
      setIsSaving(false);
      return;
    }

    if (items.some((item) => !item.description.trim())) {
      setError("All line items must have a description");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          invoiceNumber,
          status,
          issueDate,
          dueDate,
          taxRate,
          notes,
          currency,
          items: items.map((item) => ({
            ...(item.id ? { id: item.id } : {}),
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update invoice");
      }

      toast.success("Invoice updated successfully!");
      router.push("/invoices");
    } catch (err: unknown) {
      const message = getErrorMessage(err, "An error occurred while updating");
      toast.error(message);
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/pdf`);
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Fetching invoice details...
        </p>
      </div>
    );
  }

  const selectedClient = clients.find((c) => c.id === clientId) || null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Link
            href="/invoices"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background p-2.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">Edit Invoice</h1>
              {invoiceNumber && (
                <Badge variant="outline" className="font-mono text-xs uppercase">
                  {invoiceNumber}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Update billing details, line items, and issue status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Link
            href="/invoices"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Cancel
          </Link>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="xl:col-span-7 space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm border border-destructive/20 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Details Card */}
          <Card className="shadow-xs border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                Invoice Information
              </CardTitle>
              <CardDescription>
                Modify client selection, status, or date timelines.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="client" className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    Client <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="client"
                    className={`${formControlStyles} h-10`}
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a client
                    </option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.email ? `(${c.email})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className={`${formControlStyles} h-10`}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <input
                    id="invoiceNumber"
                    className={`${formControlStyles} h-10 font-mono`}
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency Code</Label>
                  <select
                    id="currency"
                    className={`${formControlStyles} h-10 uppercase font-mono`}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    {CURRENCY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <input
                    id="taxRate"
                    type="number"
                    min="0"
                    step="0.01"
                    className={`${formControlStyles} h-10`}
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issueDate" className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    Issue Date
                  </Label>
                  <input
                    id="issueDate"
                    type="date"
                    className={`${formControlStyles} h-10`}
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    Due Date <span className="text-destructive">*</span>
                  </Label>
                  <input
                    id="dueDate"
                    type="date"
                    className={`${formControlStyles} h-10`}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items Card */}
          <Card className="shadow-xs border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Line Items
                </CardTitle>
                <CardDescription>
                  Modify quantities, pricing rates, or descriptions.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={addItem}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="hidden md:grid grid-cols-[1fr_90px_110px_110px_36px] gap-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1 bg-muted/40 rounded-md">
                <span>Description</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Rate</span>
                <span className="text-right">Amount</span>
                <span></span>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-[1fr_90px_110px_110px_36px] gap-3 items-center p-3 md:p-1.5 border md:border-transparent rounded-lg bg-card"
                  >
                    <div>
                      <Label className="md:hidden text-xs text-muted-foreground mb-1 block">
                        Description
                      </Label>
                      <input
                        placeholder="Item description or service"
                        className={`${formControlStyles} h-10`}
                        value={item.description}
                        onChange={(e) =>
                          updateItem(index, "description", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label className="md:hidden text-xs text-muted-foreground mb-1 block">
                        Qty
                      </Label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={`${formControlStyles} h-10 text-left md:text-center`}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label className="md:hidden text-xs text-muted-foreground mb-1 block">
                        Rate
                      </Label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={`${formControlStyles} h-10 text-left md:text-right`}
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(index, "rate", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between md:justify-end h-10 px-1 text-sm font-semibold">
                      <span className="md:hidden text-xs text-muted-foreground font-normal">
                        Amount:
                      </span>
                      {formatMoney(getLineTotal(item))}
                    </div>

                    <div className="flex items-center justify-end md:justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(index)}
                        disabled={items.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Totals Summary */}
              <div className="flex flex-col items-end space-y-2 text-sm pt-2">
                <div className="flex justify-between w-full max-w-xs text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">
                    {formatMoney(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between w-full max-w-xs text-muted-foreground">
                  <span>Tax ({taxRate || 0}%)</span>
                  <span className="font-medium text-foreground">
                    {formatMoney(taxAmount)}
                  </span>
                </div>
                <Separator className="w-full max-w-xs my-1" />
                <div className="flex justify-between w-full max-w-xs text-base">
                  <span className="font-semibold">Total Due</span>
                  <span className="font-bold text-primary">
                    {formatMoney(total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card className="shadow-xs border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Notes & Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Include payment terms, bank details, or custom notes..."
                className={`${formControlStyles} min-h-[90px] resize-y py-2.5`}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/invoices"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Cancel
            </Link>
            <Button
              type="button"
              variant="outline"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>

        {/* Live Preview Side Column */}
        <div className="hidden xl:block xl:col-span-5 sticky top-6">
          <div className="bg-card rounded-xl border border-border/60 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <h3 className="text-base font-semibold">Live Preview</h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                Real-time
              </Badge>
            </div>
            <div className="rounded-lg overflow-hidden border border-border/40 shadow-xs bg-background">
              <InvoicePreview
                business={businessProfile}
                client={selectedClient}
                invoiceNumber={invoiceNumber}
                issueDate={issueDate}
                dueDate={dueDate}
                currency={currency}
                taxRate={taxRate}
                notes={notes}
                items={items}
                status={status}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}