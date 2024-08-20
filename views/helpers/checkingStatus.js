import OpenAI from "openai";
const openai = new OpenAI();

export const checkingStatus = async (
  res,
  threadId,
  runId,
  pollingInterval,
  dbUser,
) => {
  try {
    const runObject = await openai.beta.threads.runs.retrieve(threadId, runId);

    const status = runObject.status;

    if (status === "completed") {
      clearInterval(pollingInterval);

      const messagesList = await openai.beta.threads.messages.list(threadId);

      const assistantMessage = messagesList.body.data.find(
        (message) => message.role === "assistant",
      );

      const message = {
        time: new Date().getTime(),
        message: assistantMessage.content[0].text.value,
        role: "assistant",
      };

      const threadBundle = dbUser.threads.find(
        (thread) => thread.threadId === threadId,
      );

      threadBundle.messages.push(message);
      dbUser.markModified("threads");
      await dbUser.save();

      if (assistantMessage) {
        res.status(200).json({
          success: true,
          message: assistantMessage.content,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No response from the assistant was found.",
        });
      }
    }
  } catch (error) {
    clearInterval(pollingInterval);
    console.error("Error during status check:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking status",
      error: error.message || error,
    });
  }
};
