import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOTP(email, otp, purpose) {
  const subject = purpose === "signup"
    ? "Verify your account - HelpTogether"
    : "Your login code - HelpTogether";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
      <div style="background-color: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1f2937; font-size: 24px; margin: 0;">HelpTogether</h1>
        </div>

        <h2 style="color: #374151; font-size: 20px; margin-bottom: 16px;">
          ${purpose === "signup" ? "Welcome! Verify your email" : "Your Login Code"}
        </h2>

        <p style="color: #6b7280; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
          ${purpose === "signup"
            ? "Thank you for signing up. Please use the verification code below to complete your registration."
            : "Use the verification code below to sign in to your account."}
        </p>

        <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 8px; padding: 24px; text-align: center; margin: 32px 0;">
          <div style="font-size: 36px; font-weight: bold; color: white; letter-spacing: 8px; font-family: monospace;">
            ${otp}
          </div>
        </div>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">
          This code will expire in <strong>5 minutes</strong>.
        </p>

        <p style="color: #9ca3af; font-size: 13px; line-height: 1.5;">
          If you didn't request this code, you can safely ignore this email. Someone may have typed your email address by mistake.
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"HelpTogether" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
}
