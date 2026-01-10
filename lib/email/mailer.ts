import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
  throw new Error("Missing SMTP configuration environment variables.");
}

const port = Number(SMTP_PORT);
const secure = port === 465;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

type SendMailArgs = {
  to: string;
  subject: string;
  html: string;
};

export const sendMail = async ({ to, subject, html }: SendMailArgs) => {
  return transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    html,
  });
};
