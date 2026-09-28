import assert from "node:assert/strict";
import test from "node:test";
import { calculateInvoiceItems, calculateInvoiceTotals } from "./invoice.validation";

test("calculates subtotal, tax, and total from invoice items", () => {
  const items = calculateInvoiceItems([
    { description: "Design work", quantity: "2", rate: "125" },
    { description: "Hosting", quantity: 1, rate: 25 },
  ]);

  assert.deepEqual(calculateInvoiceTotals(items, "20"), {
    subtotal: 275,
    taxRate: 20,
    taxAmount: 55,
    total: 330,
  });
});

test("rejects invalid line items", () => {
  assert.throws(
    () => calculateInvoiceItems([{ description: " ", quantity: 1, rate: 10 }]),
    /description/
  );
  assert.throws(
    () => calculateInvoiceItems([{ description: "Work", quantity: 0, rate: 10 }]),
    /positive quantity/
  );
  assert.throws(
    () => calculateInvoiceItems([{ description: "Work", quantity: 1, rate: -1 }]),
    /valid rate/
  );
});

test("rejects tax rates outside the supported range", () => {
  const items = calculateInvoiceItems([{ description: "Work", quantity: 1, rate: 10 }]);

  assert.throws(() => calculateInvoiceTotals(items, -1), /between 0 and 100/);
  assert.throws(() => calculateInvoiceTotals(items, 101), /between 0 and 100/);
});
