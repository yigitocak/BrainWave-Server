import express from "express";
import { logoutUser } from "../views/logoutViews.js";
const router = express.Router();

router.post("/", logoutUser);

export default router;
