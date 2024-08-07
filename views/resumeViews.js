import path from "path";

export const downloadResume = async (_req, res) => {
  const filePath = path.resolve("files/resume.pdf");
  res.download(filePath, "resume.pdf", (err) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Failed to download file", success: false });
    }
  });
};
