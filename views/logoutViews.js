export const logoutUser = async (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};
