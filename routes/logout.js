import express from "express";
import { logoutUser } from "../views/logoutViews.js";
import authenticateToken from "../middlewares/authenticateToken.js";
const router = express.Router();

router.post("/", authenticateToken, logoutUser);

export default router;
