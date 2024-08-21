export const logoutUser = async (_req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "none",
  });
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};
