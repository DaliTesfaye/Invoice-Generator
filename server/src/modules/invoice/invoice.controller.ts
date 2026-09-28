import { Request, Response } from "express";
import { InvoiceStatus } from "@prisma/client";
import prisma from "../../config/db";
import { generateInvoicePdf } from "../../utils/pdf";
import { calculateInvoiceItems, calculateInvoiceTotals } from "./invoice.validation";

// GET /api/invoices — list all invoices for the logged-in user
export const getInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId },
      include: {
        client: { select: { id: true, name: true, email: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, invoices });
  } catch (error) {
    console.error("Get invoices error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/invoices/:id — get a single invoice with all items
export const getInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
      include: {
        client: true,
        items: true,
      },
    });

    if (!invoice) {
      res.status(404).json({ success: false, message: "Invoice not found" });
      return;
    }

    res.status(200).json({ success: true, invoice });
  } catch (error) {
    console.error("Get invoice error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/invoices — create a new invoice with line items
export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const {
      clientId,
      invoiceNumber,
      status = "DRAFT",
      issueDate,
      dueDate,
      taxRate,
      notes,
      currency,
      items,
    } = req.body;

    if (
      typeof clientId !== "string" ||
      typeof invoiceNumber !== "string" ||
      !invoiceNumber.trim() ||
      !dueDate
    ) {
      res.status(400).json({
        success: false,
        message: "Client, invoice number, and due date are required",
      });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: "At least one line item is required",
      });
      return;
    }

    if (!Object.values(InvoiceStatus).includes(status as InvoiceStatus)) {
      res.status(400).json({ success: false, message: "Invalid invoice status" });
      return;
    }

    const client = await prisma.client.findFirst({ where: { id: clientId, userId } });
    if (!client) {
      res.status(400).json({ success: false, message: "Selected client was not found" });
      return;
    }

    const parsedIssueDate = issueDate ? new Date(issueDate) : new Date();
    const parsedDueDate = new Date(dueDate);
    if (Number.isNaN(parsedIssueDate.getTime()) || Number.isNaN(parsedDueDate.getTime())) {
      res.status(400).json({ success: false, message: "Issue and due dates must be valid dates" });
      return;
    }

    // Check for duplicate invoice number for this user
    const existing = await prisma.invoice.findFirst({
      where: { userId, invoiceNumber: invoiceNumber.trim() },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: `Invoice number "${invoiceNumber}" already exists`,
      });
      return;
    }

    let lineItems;
    let totals;
    try {
      lineItems = calculateInvoiceItems(items);
      totals = calculateInvoiceTotals(lineItems, taxRate);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Invalid invoice values",
      });
      return;
    }

    const invoice = await prisma.invoice.create({
      data: {
        userId,
        clientId,
        invoiceNumber: invoiceNumber.trim(),
        status: status as InvoiceStatus,
        issueDate: parsedIssueDate,
        dueDate: parsedDueDate,
        ...totals,
        notes: notes || null,
        currency: currency || "USD",
        items: {
          create: lineItems,
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    res.status(201).json({ success: true, invoice });
  } catch (error) {
    console.error("Create invoice error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PUT /api/invoices/:id — update an invoice and its line items
export const updateInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const existingInvoice = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!existingInvoice) {
      res.status(404).json({ success: false, message: "Invoice not found" });
      return;
    }

    const {
      clientId,
      invoiceNumber,
      status,
      issueDate,
      dueDate,
      taxRate,
      notes,
      currency,
      items,
    } = req.body;

    // If invoice number changed, check for duplicates
    if (invoiceNumber && invoiceNumber !== existingInvoice.invoiceNumber) {
      const duplicate = await prisma.invoice.findFirst({
        where: { userId, invoiceNumber: invoiceNumber.trim(), id: { not: id } },
      });
      if (duplicate) {
        res.status(409).json({
          success: false,
          message: `Invoice number "${invoiceNumber}" already exists`,
        });
        return;
      }
    }

    const nextClientId = clientId || existingInvoice.clientId;
    const client = await prisma.client.findFirst({ where: { id: nextClientId, userId } });
    if (!client) {
      res.status(400).json({ success: false, message: "Selected client was not found" });
      return;
    }

    const nextStatus = status || existingInvoice.status;
    if (!Object.values(InvoiceStatus).includes(nextStatus as InvoiceStatus)) {
      res.status(400).json({ success: false, message: "Invalid invoice status" });
      return;
    }

    const nextIssueDate = issueDate ? new Date(issueDate) : existingInvoice.issueDate;
    const nextDueDate = dueDate ? new Date(dueDate) : existingInvoice.dueDate;
    if (Number.isNaN(nextIssueDate.getTime()) || Number.isNaN(nextDueDate.getTime())) {
      res.status(400).json({ success: false, message: "Issue and due dates must be valid dates" });
      return;
    }

    let lineItems;
    let totals = {
      subtotal: existingInvoice.subtotal,
      taxRate: existingInvoice.taxRate,
      taxAmount: existingInvoice.taxAmount,
      total: existingInvoice.total,
    };
    if (items !== undefined) {
      try {
        lineItems = calculateInvoiceItems(items);
        totals = calculateInvoiceTotals(
          lineItems,
          taxRate !== undefined ? taxRate : existingInvoice.taxRate
        );
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error instanceof Error ? error.message : "Invalid invoice values",
        });
        return;
      }
    }

    // Use a transaction to delete old items and create new ones
    const invoice = await prisma.$transaction(async (tx) => {
      if (lineItems) {
        await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
      }

      return tx.invoice.update({
        where: { id },
        data: {
          clientId: nextClientId,
          invoiceNumber: invoiceNumber ? invoiceNumber.trim() : existingInvoice.invoiceNumber,
          status: nextStatus as InvoiceStatus,
          issueDate: nextIssueDate,
          dueDate: nextDueDate,
          ...totals,
          notes: notes !== undefined ? notes : existingInvoice.notes,
          currency: currency || existingInvoice.currency,
          ...(lineItems ? { items: { create: lineItems } } : {}),
        },
        include: {
          client: true,
          items: true,
        },
      });
    });

    res.status(200).json({ success: true, invoice });
  } catch (error) {
    console.error("Update invoice error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /api/invoices/:id
export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const existingInvoice = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!existingInvoice) {
      res.status(404).json({ success: false, message: "Invoice not found" });
      return;
    }

    await prisma.invoice.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Delete invoice error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/invoices/next-number — generate the next invoice number
export const getNextInvoiceNumber = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    // Get the user's invoice prefix from their business profile
    const profile = await prisma.businessProfile.findUnique({
      where: { userId },
      select: { invoicePrefix: true },
    });

    const prefix = profile?.invoicePrefix || "INV";

    // Count existing invoices to generate the next number
    const count = await prisma.invoice.count({ where: { userId } });
    const nextNumber = `${prefix}-${String(count + 1).padStart(4, "0")}`;

    res.status(200).json({ success: true, nextNumber });
  } catch (error) {
    console.error("Get next invoice number error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/invoices/:id/pdf
export const downloadInvoicePdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const pdfBuffer = await generateInvoicePdf(id, userId);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="invoice-${id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Download PDF error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
