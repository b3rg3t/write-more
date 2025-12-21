import { Router } from "express";
import { signup, signin, getCurrentUser } from "../controller/authController";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", authenticate, getCurrentUser);

export default router;
