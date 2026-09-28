import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
} from "./client.controller";

const router = Router();

router.use(protect);

router.route("/")
  .get(getClients)
  .post(createClient);

router.route("/:id")
  .get(getClient)
  .put(updateClient)
  .delete(deleteClient);

export default router;
