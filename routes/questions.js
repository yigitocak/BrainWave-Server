import express from "express";
import authenticateToken from "../middlewares/authenticateToken.js";
import {
  getQuestionsView,
  getSpecificQuestionView,
  askToAIView,
  getAllMessages,
  getOngoing,
  completeView,
  getSolved,
} from "../views/questionViews.js";

const questions = express.Router();

questions.get("/", getQuestionsView);
questions.get("/ongoing", authenticateToken, getOngoing);
questions.get("/solved", authenticateToken, getSolved);
questions.get("/:questionId", authenticateToken, getSpecificQuestionView);
questions.get("/:questionId/ask", authenticateToken, getAllMessages);
questions.post("/:questionId/ask", authenticateToken, askToAIView);
questions.post("/:questionId/complete", authenticateToken, completeView);

export default questions;
