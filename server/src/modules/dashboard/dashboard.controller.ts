import { Request, Response } from "express";
import prisma from "../../config/db";
import { InvoiceStatus } from "@prisma/client";

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    // Get all invoices for the user
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { issueDate: 'desc' },
    });

    const totalInvoicesCount = invoices.length;
    
    // Total Revenue (PAID)
    const totalRevenue = invoices
      .filter((inv) => inv.status === InvoiceStatus.PAID)
      .reduce((sum, inv) => sum + inv.total, 0);

    // Pending Amount (DRAFT + SENT)
    const pendingAmount = invoices
      .filter((inv) => inv.status === InvoiceStatus.DRAFT || inv.status === InvoiceStatus.SENT)
      .reduce((sum, inv) => sum + inv.total, 0);

    // Overdue Amount (OVERDUE)
    const overdueAmount = invoices
      .filter((inv) => inv.status === InvoiceStatus.OVERDUE)
      .reduce((sum, inv) => sum + inv.total, 0);

    // Total Clients
    const clientsCount = await prisma.client.count({
      where: { userId },
    });

    // Recent 5 invoices with client details
    const recentInvoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { issueDate: 'desc' },
      take: 5,
      include: {
        client: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalInvoicesCount,
        totalRevenue,
        pendingAmount,
        overdueAmount,
        clientsCount,
      },
      recentInvoices,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
