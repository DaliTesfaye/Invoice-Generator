import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getNextInvoiceNumber,
  downloadInvoicePdf,
} from "./invoice.controller";

const router = Router();

router.use(protect);

// Must be before /:id to avoid matching "next-number" as an id
router.get("/next-number", getNextInvoiceNumber);

router.route("/")
  .get(getInvoices)
  .post(createInvoice);

// Must be before /:id catch-all to avoid conflict
router.get("/:id/pdf", downloadInvoicePdf);

router.route("/:id")
  .get(getInvoice)
  .put(updateInvoice)
  .delete(deleteInvoice);

export default router;
