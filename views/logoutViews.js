export const logoutUser = async (_req, res) => {
  res.clearCookie("authToken", {
    secure: process.env.NODE_ENV === "production",
  });
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};
