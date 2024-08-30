import jwt from "jsonwebtoken";

export const generateToken = (user, rememberMe) => {
  const SECRET_KEY = process.env.SECRET_KEY;
  if (!SECRET_KEY) {
    throw new Error("Internal server error. SECRET_KEY is not defined.");
  }

  const expiresIn = rememberMe ? "7d" : "12h";
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.name,
    },
    SECRET_KEY,
    { expiresIn },
  );
};
