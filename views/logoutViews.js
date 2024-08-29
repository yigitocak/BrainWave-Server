export const logoutUser = async (_req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};
