import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (email, resetUrl) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"BrainTeaser" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste this into your browser to complete the process: ${resetUrl}. If you did not request this, please ignore this email and your password will remain unchanged.`,
      html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
             <p>Please click on the following link, or paste this into your browser to complete the process:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Could not send reset password email.");
  }
};
