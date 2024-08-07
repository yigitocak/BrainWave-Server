import express from "express";
import { downloadResume } from "../views/resumeViews.js";
const resume = express.Router();

resume.get("/", downloadResume);

export default resume;
