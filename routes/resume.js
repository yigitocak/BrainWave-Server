import express from "express";
import { downloadResume } from "../views/resumeViews.js";
const resume = express.Router();

resume.use(express.json());

resume.get("/", downloadResume);

export default resume;
