export type InvoiceItemInput = {
  description: unknown;
  quantity: unknown;
  rate: unknown;
};

export type CalculatedInvoiceItem = {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

export function calculateInvoiceItems(items: unknown): CalculatedInvoiceItem[] {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("At least one line item is required");
  }

  return items.map((rawItem: InvoiceItemInput) => {
    const quantity = Number(rawItem.quantity);
    const rate = Number(rawItem.rate);

    if (
      typeof rawItem.description !== "string" ||
      !rawItem.description.trim() ||
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !Number.isFinite(rate) ||
      rate < 0
    ) {
      throw new Error("Each line item needs a description, positive quantity, and valid rate");
    }

    return {
      description: rawItem.description.trim(),
      quantity,
      rate,
      amount: quantity * rate,
    };
  });
}

export function calculateInvoiceTotals(items: CalculatedInvoiceItem[], taxRateInput: unknown) {
  const taxRate = Number(taxRateInput ?? 0);
  if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100) {
    throw new Error("Tax rate must be between 0 and 100");
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);

  return {
    subtotal,
    taxRate,
    taxAmount,
    total: subtotal + taxAmount,
  };
}
