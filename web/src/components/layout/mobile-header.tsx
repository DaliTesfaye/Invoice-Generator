"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Zap, PlusCircle, LayoutDashboard, FileText, Users, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Invoices",  href: "/invoices",  icon: FileText },
  { label: "Clients",   href: "/clients",   icon: Users },
  { label: "Settings",  href: "/settings",  icon: Settings },
];

export function MobileHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="flex md:hidden items-center justify-between px-4 h-[60px] border-b border-border bg-card shrink-0">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary">
          <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          InvoiceKit
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <Button asChild size="sm" className="h-8 gap-1.5 text-xs">
          <Link href="/invoices/new">
            <PlusCircle className="w-3.5 h-3.5" />
            New
          </Link>
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="outline" size="sm" className="h-8 w-8 p-0" />}
          >
              <Menu className="w-4 h-4" />
              <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0">
            {/* Sheet Logo */}
            <div className="flex items-center gap-2.5 px-5 h-[60px] border-b border-border">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-foreground">
                InvoiceKit
              </span>
            </div>

            <Separator />

            <nav className="flex flex-col px-3 py-3 space-y-0.5">
              {navItems.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive(href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </Link>
              ))}
            </nav>

            <Separator />

            <div className="px-3 py-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-md text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground text-left"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Log out
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
