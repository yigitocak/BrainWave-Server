import path from "path";

export const downloadResume = async (_req, res) => {
  try {
    const filePath = path.resolve("files/resume.pdf");
    res.download(filePath, "yigit-ocak-resume.pdf", (err) => {
      if (err) {
        console.error("Failed to download file:", err);
        res
          .status(500)
          .json({ message: "Failed to download file", success: false });
      }
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
