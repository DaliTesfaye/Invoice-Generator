"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  FileText,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Phone,
  Mail,
  Coins,
  Hash,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";
import Image from "next/image";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    country: "",
    logoUrl: "",
    currency: "USD",
    invoicePrefix: "INV",
    paymentTerms: "30",
    defaultNotes: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (res.ok && data.profile) {
          setFormData((prev) => ({
            ...prev,
            ...data.profile,
            paymentTerms: data.profile.paymentTerms?.toString() || "30",
          }));
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      toast.success("Profile settings updated successfully");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to update profile"));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Settings
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage your business identity, location, and default invoice preferences.
          </p>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Alerts */}
        {error && (
          <div className="p-4 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* 1. Business Profile */}
        <Card className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Business Profile</CardTitle>
                <CardDescription className="text-slate-500 text-xs sm:text-sm">
                  Primary details displayed at the top of your issued invoices.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">

            {/* Logo Upload Box */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-800">Company Logo</Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="shrink-0">
                  {formData.logoUrl ? (
                    <Image
                      src={formData.logoUrl}
                      alt="Logo preview"
                      width={80}
                      height={80}
                      unoptimized
                      className="h-20 w-20 object-contain rounded-xl border border-slate-200 bg-white p-2 shadow-sm"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center bg-white text-slate-400 p-2 text-center">
                      <Building2 className="w-7 h-7 mb-1 text-slate-400" />
                      <span className="text-[10px] uppercase font-bold text-slate-400">No Logo</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-sm font-semibold transition-colors border border-slate-300 shadow-sm"
                    >
                      <Upload className="w-4 h-4 text-slate-600" />
                      Upload Logo
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    {formData.logoUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setFormData({ ...formData, logoUrl: "" })}
                        className="h-10 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Supports PNG, JPG, or SVG (Max 2MB). Recommended aspect ratio 1:1.
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Business Info Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-800">
                  Business Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    placeholder="Acme Studio Inc."
                    className="pl-10 h-11 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-slate-800">
                  Business Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    placeholder="billing@acme.com"
                    className="pl-10 h-11 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-slate-800">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    placeholder="+1 (555) 012-3456"
                    className="pl-10 h-11 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-semibold text-slate-800">
                  Website URL
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="website"
                    name="website"
                    value={formData.website || ""}
                    onChange={handleChange}
                    placeholder="https://acme.com"
                    className="pl-10 h-11 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Address Details */}
        <Card className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Address & Location</CardTitle>
                <CardDescription className="text-slate-500 text-xs sm:text-sm">
                  Your registered business address for invoicing and tax filings.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-semibold text-slate-800">
                Street Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="123 Market Street, Suite 400"
                className="h-11 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-semibold text-slate-800">
                  City / State / Zip
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                  placeholder="San Francisco, CA 94105"
                  className="h-11 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-semibold text-slate-800">
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country || ""}
                  onChange={handleChange}
                  placeholder="United States"
                  className="h-11 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Invoice Defaults */}
        <Card className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Invoice Defaults</CardTitle>
                <CardDescription className="text-slate-500 text-xs sm:text-sm">
                  Default parameters automatically populated when creating new invoices.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-semibold text-slate-800">
                  Currency
                </Label>
                <div className="relative">
                  <Coins className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="currency"
                    name="currency"
                    value={formData.currency || ""}
                    onChange={handleChange}
                    placeholder="USD"
                    className="pl-10 h-11 rounded-xl bg-white border-slate-300 text-slate-900 uppercase placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoicePrefix" className="text-sm font-semibold text-slate-800">
                  Invoice Prefix
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="invoicePrefix"
                    name="invoicePrefix"
                    value={formData.invoicePrefix || ""}
                    onChange={handleChange}
                    placeholder="INV"
                    className="pl-10 h-11 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms" className="text-sm font-semibold text-slate-800">
                  Payment Due (Days)
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="paymentTerms"
                    name="paymentTerms"
                    type="number"
                    min="0"
                    value={formData.paymentTerms || ""}
                    onChange={handleChange}
                    placeholder="30"
                    className="pl-10 h-11 rounded-xl bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
                  />
                </div>
              </div>

            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultNotes" className="text-sm font-semibold text-slate-800">
                Default Terms & Payment Notes
              </Label>
              <textarea
                id="defaultNotes"
                name="defaultNotes"
                value={formData.defaultNotes || ""}
                onChange={handleChange}
                placeholder="Thank you for your business! Payment is requested within 30 days of invoice date."
                rows={4}
                className="flex w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all resize-y shadow-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Action */}
        <div className="flex items-center justify-end pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-12 px-8 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}