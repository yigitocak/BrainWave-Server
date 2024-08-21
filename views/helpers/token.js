import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (user, rememberMe, res) => {
  const SECRET_KEY = process.env.SECRET_KEY;
  if (!SECRET_KEY) {
    return res.status(500).json({
      message: "Internal server error. SECRET_KEY is not defined.",
      success: false,
    });
  }

  const expiresIn = rememberMe ? "7d" : "12h";
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.name,
    },
    SECRET_KEY,
    { expiresIn },
  );

  console.log("Setting authToken cookie with options:", {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "None",
    maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000,
  });

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "none",
    maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000,
  });

  return token;
};
