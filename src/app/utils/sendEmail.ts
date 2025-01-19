import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, passResetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.node_env === "production", // prod e true hobe
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  });

  await transporter.sendMail({
    from: "ainnayeem9@gmail.com", // sender address
    to, // list of receivers
    subject: "Password Reset Request for Niro University", // Subject line
    text: "Hello, \n\nWe received a request to reset your password for your Niro University account. If you made this request, please click the link below to reset your password within ten minutes:\n\n[Insert Reset Link Here]\n\nIf you did not request this, you can safely ignore this email. Your password will not be changed.\n\nBest regards,\nNiro University Team",
    html: `
        <p>Hello,</p>
        <p>We received a request to reset your password for your <strong>Niro University</strong> account. If you made this request, please click the button below to reset your password within ten minutes:</p>
        <p><a href="${passResetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>If you did not request this, you can safely ignore this email. Your password will not be changed.</p>
        <p>Best regards,<br>Niro University Team</p>
    `,
  });
};
