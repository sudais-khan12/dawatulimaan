import { getSupabaseClient } from "@/lib/supabase/client";

type Recipient = {
  personId: string;
  email: string;
  fullName?: string | null;
};

type SendPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

type EmailSender = (payload: SendPayload) => Promise<void>;

type RegistrationRow = {
  person_id: string;
  event_id: string;
  people: {
    email: string;
    first_name?: string | null;
    last_name?: string | null;
  } | null;
};

type EventEmailLog = {
  id?: string;
  event_id: string;
  person_id: string;
  email: string;
  created_at?: string;
};

const parseRecipients = (rows: RegistrationRow[]): Recipient[] => {
  const unique = new Map<string, Recipient>();

  rows.forEach((row) => {
    const email = row.people?.email;
    if (!email) return;

    if (!unique.has(email)) {
      unique.set(email, {
        personId: row.person_id,
        email,
        fullName: `${row.people?.first_name ?? ""} ${row.people?.last_name ?? ""}`.trim(),
      });
    }
  });

  return Array.from(unique.values());
};

export const getUniqueRecipientsForEvent = async (
  eventId: string,
  client = getSupabaseClient()
): Promise<{ data: Recipient[]; error: Error | null }> => {
  const { data, error } = await client
    .from("registrations")
    .select(
      "person_id, event_id, people:person_id(email, first_name, last_name)",
    )
    .eq("event_id", eventId);

  if (error || !data) {
    return { data: [], error: error ?? new Error("No data returned") };
  }

  return {
    data: parseRecipients(data as unknown as RegistrationRow[]),
    error: null,
  };
};

const recordEmailOnce = async (
  log: EventEmailLog,
  client = getSupabaseClient()
): Promise<{ created: boolean; error: Error | null }> => {
  const { error } = await client
    .from("event_email_sends")
    .upsert(log, { onConflict: "event_id,email" });

  if (error) {
    // Ignore unique constraint violations to maintain idempotency.
    if (error.code === "23505" || error.code === "409") {
      return { created: false, error: null };
    }
    return { created: false, error };
  }

  return { created: true, error: null };
};

type SendEventEmailsArgs = {
  eventId: string;
  subject: string;
  buildMessage: (recipient: Recipient) => Omit<SendPayload, "to" | "subject">;
  sendEmail: EmailSender;
};

export const sendEventEmailsOnce = async ({
  eventId,
  subject,
  buildMessage,
  sendEmail,
}: SendEventEmailsArgs): Promise<{
  sent: string[];
  skipped: string[];
  errors: Error[];
}> => {
  const client = getSupabaseClient();
  const { data: recipients, error } = await getUniqueRecipientsForEvent(
    eventId,
    client
  );

  if (error) {
    return { sent: [], skipped: [], errors: [error] };
  }

  const sent: string[] = [];
  const skipped: string[] = [];
  const errors: Error[] = [];

  for (const recipient of recipients) {
    const log: EventEmailLog = {
      event_id: eventId,
      person_id: recipient.personId,
      email: recipient.email,
    };

    const { created, error: logError } = await recordEmailOnce(log, client);
    if (logError) {
      errors.push(logError);
      continue;
    }

    if (!created) {
      skipped.push(recipient.email);
      continue;
    }

    try {
      const message = buildMessage(recipient);
      await sendEmail({
        to: recipient.email,
        subject,
        ...message,
      });
      sent.push(recipient.email);
    } catch (sendError) {
      errors.push(sendError as Error);
    }
  }

  return { sent, skipped, errors };
};
