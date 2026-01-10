"use server";

import { sendEventEmailsOnce } from "@/lib/communication/event-email";

export async function sendDemoEventEmails() {
  const eventId = "demo-event";
  const subject = "Upcoming event update";

  const result = await sendEventEmailsOnce({
    eventId,
    subject,
    buildMessage: (recipient) => ({
      text: `Hi ${
        recipient.fullName ?? "there"
      }, thanks for registering for our event. We'll share more details soon.`,
    }),
    // Placeholder sender: replace with real email provider integration.
    sendEmail: async ({ to, subject: emailSubject, text }) => {
      console.log("Send email", { to, subject: emailSubject, text });
    },
  });

  console.log("Email send summary", result);

  // Server actions used as form actions should not return a value.
  return;
}
