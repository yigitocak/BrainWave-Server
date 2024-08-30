export const logoutUser = async (_req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};
