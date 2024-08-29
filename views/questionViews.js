import Challenges from "../models/Challenges.js";
import Users from "../models/Users.js";
import OpenAI from "openai";
import "dotenv/config";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
import { checkingStatus } from "./helpers/checkingStatus.js";

export const getQuestionsView = async (_req, res) => {
  try {
    const questions = await Challenges.aggregate([
      {
        $addFields: {
          difficultyOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$difficulty", "Easy"] }, then: 1 },
                { case: { $eq: ["$difficulty", "Medium"] }, then: 2 },
                { case: { $eq: ["$difficulty", "Hard"] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      {
        $sort: { difficultyOrder: 1 },
      },
      {
        $project: {
          difficultyOrder: 0,
          question: 0,
        },
      },
    ]);

    res.status(200).json({ questions, success: true });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const getOngoing = async (req, res) => {
  const { email } = req.user;

  if (!email) {
    return res.status(400).json({ message: "Bad request", success: false });
  }

  try {
    const dbUser = await Users.findOne({ email });

    if (!dbUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res.status(200).json({ onGoing: dbUser.onGoingQuestions });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const getSpecificQuestionView = async (req, res) => {
  const { questionId } = req.params;
  try {
    const foundQuestion = await Challenges.findOne({ questionId });
    if (!foundQuestion) {
      return res
        .status(404)
        .json({ message: "Question not found", success: false });
    }

    return res
      .status(200)
      .json({ question: foundQuestion.question, success: true });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

export const getSolved = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: "User not found", success: false });
  }

  const { email } = user;

  try {
    const dbUser = await Users.findOne({ email });
    if (!dbUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res.status(200).json({ solvedQuestions: dbUser.solvedQuestions });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllMessages = async (req, res) => {
  const { questionId } = req.params;
  const { email } = req.user;

  if (!email || !questionId) {
    return res
      .status(400)
      .json({ message: "Bad request body", success: false });
  }

  try {
    const dbUser = await Users.findOne({ email });
    if (!dbUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const foundQuestion = await Challenges.findOne({ questionId });
    if (!foundQuestion) {
      return res
        .status(404)
        .json({ message: "Question doesn't exist", success: false });
    }

    const userThread = dbUser.threads.find(
      (thread) => thread.questionId === questionId,
    );

    if (!userThread) {
      return res
        .status(404)
        .json({ message: "No thread found", success: false });
    }

    const sortedMessages = userThread.messages.sort((a, b) => a.time - b.time);

    return res.status(200).json({ success: true, messages: sortedMessages });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const askToAIView = async (req, res) => {
  const { questionId } = req.params;
  const { userInput } = req.body;
  const { email } = req.user;

  if (!email || !questionId || !userInput) {
    return res
      .status(400)
      .json({ message: "Bad request body", success: false });
  }

  try {
    const foundQuestion = await Challenges.findOne({ questionId });
    if (!foundQuestion) {
      return res
        .status(404)
        .json({ message: "Question doesn't exist", success: false });
    }

    const dbUser = await Users.findOne({ email });

    if (!dbUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    let threadId;
    let runId;

    const existingQuestionBundle = dbUser.threads.find(
      (thread) => thread.questionId === questionId,
    );

    const assistant = await openai.beta.assistants.retrieve(
      process.env.ASSISTANT_ID,
    );

    if (!existingQuestionBundle) {
      const questionInfo = { title: foundQuestion.title, questionId };
      dbUser.onGoingQuestions.push(questionInfo);

      const createdThread = await openai.beta.threads.create();
      threadId = createdThread.id;

      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: `Question: ${foundQuestion.question}`,
      });

      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: `${userInput}`,
      });

      const getRunId = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistant.id,
      });

      runId = getRunId.id;

      const bundle = {
        questionId: questionId,
        threadId: threadId,
        messages: [
          {
            time: new Date().getTime(),
            message: `Question: ${foundQuestion.question}`,
            role: "assistant",
          },
          {
            time: new Date().getTime(),
            message: `${userInput}`,
            role: "user",
          },
        ],
      };

      dbUser.threads.push(bundle);
      dbUser.markModified("threads");
      await dbUser.save();
    } else {
      threadId = existingQuestionBundle.threadId;

      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: `${userInput}`,
      });

      const message = {
        time: new Date().getTime(),
        message: `${userInput}`,
        role: "user",
      };

      existingQuestionBundle.messages.push(message);

      dbUser.markModified("threads");
      await dbUser.save();

      const getRunId = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistant.id,
      });

      runId = getRunId.id;
    }

    const pollingInterval = setInterval(() => {
      checkingStatus(res, threadId, runId, pollingInterval, dbUser);
    }, 2000);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const completeView = async (req, res) => {
  const { questionId } = req.params;
  const { email } = req.user;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.solvedQuestions.includes(questionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Question already marked as solved" });
    }

    user.solvedQuestions.push(questionId);
    user.markModified("solvedQuestions");
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Question successfully marked as complete",
    });
  } catch (error) {
    console.error("Error in completeView:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
