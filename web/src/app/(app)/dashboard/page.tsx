import { FileText, Users, TrendingUp, Clock } from "lucide-react";

const stats = [
  { label: "Total Invoiced",  value: "€0.00",   icon: TrendingUp, sub: "This month" },
  { label: "Invoices",        value: "0",        icon: FileText,   sub: "All time" },
  { label: "Clients",         value: "0",        icon: Users,      sub: "Active" },
  { label: "Pending",         value: "€0.00",    icon: Clock,      sub: "Awaiting payment" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Good afternoon 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your invoices.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, sub }) => (
          <div
            key={label}
            className="bg-card border border-border rounded-lg p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{label}</span>
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-accent">
                <Icon className="w-4 h-4 text-accent-foreground" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* Recent invoices placeholder */}
      <div className="bg-card border border-border rounded-lg shadow-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Recent Invoices</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No invoices yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Create your first invoice to get started.</p>
        </div>
      </div>
    </div>
  );
}
