"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Loader2,
  AlertCircle,
  UserPlus,
  Users,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { getErrorMessage } from "@/lib/errors";

type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  taxId: string | null;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    taxId: "",
  });

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (data.success) {
        setClients(data.clients);
      }
    } catch (err) {
      console.error("Failed to fetch clients", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenSheet = (client?: Client) => {
    setError("");
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email || "",
        phone: client.phone || "",
        address: client.address || "",
        city: client.city || "",
        country: client.country || "",
        taxId: client.taxId || "",
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        taxId: "",
      });
    }
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditingClient(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const url = editingClient ? `/api/clients/${editingClient.id}` : "/api/clients";
      const method = editingClient ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save client");
      }

      await fetchClients();
      handleCloseSheet();
      toast.success(editingClient ? "Client updated!" : "Client created!");
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to save client");
      toast.error(message);
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;

    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete client");

      await fetchClients();
      toast.success("Client deleted successfully");
    } catch (err: unknown) {
      console.error("Delete error:", err);
      toast.error(getErrorMessage(err, "Failed to delete client"));
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            Clients
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage your client directory, contact records, and tax identifiers.
          </p>
        </div>
        <Button
          onClick={() => handleOpenSheet()}
          className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add Client
        </Button>
      </div>

      {/* Search Bar & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by client name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600 shadow-sm"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500 self-end sm:self-center">
          Showing {filteredClients.length} {filteredClients.length === 1 ? "client" : "clients"}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="min-h-[40vh] w-full flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium">Loading clients...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <Card className="border-slate-200 bg-white shadow-sm rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
            <Users className="w-7 h-7" />
          </div>
          <CardTitle className="text-lg font-bold text-slate-900 mb-1">
            {searchQuery ? "No matching clients found" : "No clients added yet"}
          </CardTitle>
          <CardDescription className="text-slate-500 max-w-sm mb-6">
            {searchQuery
              ? "We couldn't find any client matching your search criteria. Try a different term."
              : "Get started by adding your first client to streamline invoice generation."}
          </CardDescription>
          {!searchQuery && (
            <Button
              onClick={() => handleOpenSheet()}
              className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm gap-2"
            >
              <Plus className="w-4 h-4" />
              Add your first client
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => {
            const initial = client.name ? client.name.charAt(0).toUpperCase() : "C";
            return (
              <Card
                key={client.id}
                className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden flex flex-col group"
              >
                <CardHeader className="p-5 pb-4 border-b border-slate-100 bg-slate-50/40">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-base shrink-0">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base font-bold text-slate-900 truncate" title={client.name}>
                          {client.name}
                        </CardTitle>
                        {client.taxId && (
                          <span className="inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-0.5 border border-slate-200/60">
                            TAX: {client.taxId}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => handleOpenSheet(client)}
                        title="Edit client"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(client.id)}
                        title="Delete client"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-5 flex-1 space-y-3 text-xs text-slate-600">
                  {client.email ? (
                    <div className="flex items-center gap-2.5 truncate text-slate-700">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{client.email}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-slate-400 italic">
                      <Mail className="w-4 h-4 shrink-0" />
                      <span>No email provided</span>
                    </div>
                  )}

                  {client.phone ? (
                    <div className="flex items-center gap-2.5 truncate text-slate-700">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate font-medium">{client.phone}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-slate-400 italic">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>No phone provided</span>
                    </div>
                  )}

                  {(client.address || client.city || client.country) ? (
                    <div className="flex items-start gap-2.5 text-slate-700 pt-1">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2 leading-relaxed">
                        {[client.address, client.city, client.country].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-slate-400 italic">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>No address provided</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Client Slide-Over Drawer */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="bg-white border-l border-slate-200 sm:max-w-md p-0 flex flex-col justify-between">

          <div>
            {/* Sheet Header */}
            <SheetHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                  {editingClient ? <Building2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <div>
                  <SheetTitle className="text-lg font-bold text-slate-900">
                    {editingClient ? "Edit Client" : "Add New Client"}
                  </SheetTitle>
                  <SheetDescription className="text-slate-500 text-xs">
                    {editingClient ? "Update client records for invoices and billing." : "Enter business details for your new client."}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            {/* Sheet Form */}
            <form id="client-form" onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-slate-800">
                  Client / Business Name *
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Acme Corporation"
                    className="pl-10 h-10 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-800">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="billing@acme.com"
                    className="pl-10 h-10 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold text-slate-800">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="pl-10 h-10 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs font-semibold text-slate-800">
                  Street Address
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Corporate Blvd"
                    className="pl-10 h-10 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-xs font-semibold text-slate-800">
                    City / Region
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    className="h-10 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-xs font-semibold text-slate-800">
                    Country
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="United States"
                      className="pl-8 h-10 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <Label htmlFor="taxId" className="text-xs font-semibold text-slate-800">
                  Tax ID / VAT Registration
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="taxId"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    placeholder="US123456789"
                    className="pl-10 h-10 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600 text-sm"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Sheet Footer */}
          <SheetFooter className="p-4 bg-slate-50 border-t border-slate-200 flex flex-row items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseSheet}
              disabled={isSaving}
              className="h-10 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="client-form"
              disabled={isSaving}
              className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingClient ? (
                "Save Changes"
              ) : (
                "Add Client"
              )}
            </Button>
          </SheetFooter>

        </SheetContent>
      </Sheet>

    </div>
  );
}