import { Router } from "express";
import { getProfile, updateProfile } from "./profile.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.use(protect); // All profile routes require authentication

router.route("/")
  .get(getProfile)
  .put(updateProfile);

export default router;
