import { Router } from "express";
import { login, register } from "../service/authController";


const router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
