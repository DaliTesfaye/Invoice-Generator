"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Users,
  TrendingUp,
  Clock,
  Plus,
  AlertTriangle,
  ArrowRight,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type DashboardStats = {
  totalInvoicesCount: number;
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  clientsCount: number;
  currency: string;
};

type RecentInvoice = {
  id: string;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  total: number;
  currency: string;
  client: { name: string; email: string | null };
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<RecentInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard/stats", { cache: "no-store" });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecentInvoices(data.recentInvoices || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount || 0);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  // Welcome / Empty State
  const hasDashboardData =
    (stats?.totalInvoicesCount ?? 0) > 0 || (stats?.clientsCount ?? 0) > 0;

  if (!hasDashboardData) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-card border rounded-2xl p-8 sm:p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">Welcome to your Dashboard! 👋</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            You&apos;re all set up. To get started, let&apos;s create your very first client and send them a beautiful invoice.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto gap-2" asChild>
              <Link href="/clients">
                <Users className="w-4 h-4" />
                Add First Client
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2" asChild>
              <Link href="/settings">
                <Settings className="w-4 h-4" />
                Setup Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Good afternoon 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s an overview of your business metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/clients">View Clients</Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/invoices/new">
              <Plus className="w-4 h-4" />
              New Invoice
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(stats?.totalRevenue || 0, stats?.currency)}
          </div>
          <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            From {stats?.totalInvoicesCount} invoices
          </div>
        </div>

        {/* Pending Amount */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Pending</span>
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(stats?.pendingAmount || 0, stats?.currency)}
          </div>
          <div className="text-xs text-muted-foreground mt-2">Awaiting payment</div>
        </div>

        {/* Overdue Amount */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Overdue</span>
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(stats?.overdueAmount || 0, stats?.currency)}
          </div>
          <div className="text-xs text-muted-foreground mt-2">Needs immediate action</div>
        </div>

        {/* Total Clients */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Clients</span>
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {stats?.clientsCount || 0}
          </div>
          <div className="text-xs text-muted-foreground mt-2">Active clients</div>
        </div>
      </div>

      {/* Recent invoices */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted/20">
          <h2 className="text-base font-semibold text-foreground">Recent Invoices</h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground gap-1 hover:text-foreground" asChild>
            <Link href="/invoices">
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-foreground">No invoices yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Create your first invoice to get started.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/invoices/new">Create Invoice</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/30 uppercase border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Invoice</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Issue Date</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/invoices/${inv.id}`}
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {inv.client.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(inv.issueDate)}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {formatCurrency(inv.total, inv.currency)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {inv.status === "PAID" && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Paid
                        </Badge>
                      )}
                      {inv.status === "SENT" && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Sent
                        </Badge>
                      )}
                      {inv.status === "OVERDUE" && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Overdue
                        </Badge>
                      )}
                      {inv.status === "DRAFT" && (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          Draft
                        </Badge>
                      )}
                      {inv.status === "CANCELLED" && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Cancelled
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
